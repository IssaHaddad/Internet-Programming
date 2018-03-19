import java.io.*;
import java.net.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Date;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import org.jruby.*;

public class Test{
	
	public static void main(String[] args)
	{	int port = 4001;
	try
	{
		ServerSocket server = new ServerSocket(port);

		Socket connection = null;;
		while (true) {		
			 
			connection = server.accept();	
			Server conn = new Server(connection);
			conn.run();
		}
	}
	catch(IOException ex)
	{
		System.out.println("Error: " + ex.getMessage());
	}
	}
}
