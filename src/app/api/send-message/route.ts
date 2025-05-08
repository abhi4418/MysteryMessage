import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { Message } from '@/model/User';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  
  // Get the sender's IP address
  const headersList = headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const senderIP = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

  try {
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        { message: 'User is not accepting messages', success: false },
        { status: 403 } // 403 Forbidden status
      );
    }

    // Check if the sender's IP is blocked
    if (user.blockedIPs && user.blockedIPs.includes(senderIP)) {
      return Response.json(
        { message: 'You have been blocked by this user', success: false },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date(), senderIP };

    // Push the new message to the user's messages array
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
