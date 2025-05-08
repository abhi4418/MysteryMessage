import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { ipToBlock, action } = await request.json();

  // Special case for unblock-all action
  if (action === 'unblock-all') {
    try {
      const dbUser = await UserModel.findById(userId);
      
      if (!dbUser) {
        return Response.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      // Clear the blockedIPs array
      dbUser.blockedIPs = [];
      await dbUser.save();
      
      return Response.json(
        { success: true, message: 'All IP addresses unblocked successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error unblocking all IPs:', error);
      return Response.json(
        { success: false, message: 'Error unblocking all IP addresses' },
        { status: 500 }
      );
    }
  }

  if (!ipToBlock) {
    return Response.json(
      { success: false, message: 'IP address is required' },
      { status: 400 }
    );
  }

  if (action !== 'block' && action !== 'unblock') {
    return Response.json(
      { success: false, message: 'Action must be either "block" or "unblock"' },
      { status: 400 }
    );
  }

  try {
    const dbUser = await UserModel.findById(userId);
    
    if (!dbUser) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (action === 'block') {
      // Add IP to blocked list if not already there
      if (!dbUser.blockedIPs.includes(ipToBlock)) {
        dbUser.blockedIPs.push(ipToBlock);
        await dbUser.save();
      }
      
      return Response.json(
        { success: true, message: 'IP address blocked successfully' },
        { status: 200 }
      );
    } else {
      // Remove IP from blocked list
      dbUser.blockedIPs = dbUser.blockedIPs.filter(ip => ip !== ipToBlock);
      await dbUser.save();
      
      return Response.json(
        { success: true, message: 'IP address unblocked successfully' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error updating IP block status:', error);
    return Response.json(
      { success: false, message: 'Error updating IP block status' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();

  // Get the user session
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // Check if the user is authenticated
  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Retrieve the user from the database using the ID
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      // User not found
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user's blocked IPs
    return Response.json(
      {
        success: true,
        blockedIPs: foundUser.blockedIPs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving blocked IPs:', error);
    return Response.json(
      { success: false, message: 'Error retrieving blocked IPs' },
      { status: 500 }
    );
  }
} 