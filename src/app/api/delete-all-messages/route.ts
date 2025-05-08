import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function DELETE(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  
  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const result = await UserModel.updateOne(
      { _id: user._id },
      { $set: { messages: [] } }
    );

    if (result.modifiedCount === 0) {
      return Response.json(
        { message: 'User not found or no messages to delete', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'All messages deleted successfully', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting all messages:', error);
    return Response.json(
      { message: 'Error deleting all messages', success: false },
      { status: 500 }
    );
  }
} 