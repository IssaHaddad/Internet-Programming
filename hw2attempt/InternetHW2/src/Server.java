import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import java.net.Socket;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Date;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.swing.InputMap;

public class Server implements Runnable{
	private Socket connection;
	
	public Server(Socket conn){
		connection = conn;
	}
	
	public void run(){
		try {
			
			
			//DataInputStream dataInput = new DataInputStream(connection.getInputStream());
			InputStream raw = connection.getInputStream( );
			BufferedInputStream buffer = new BufferedInputStream(raw);
			InputStreamReader input = new InputStreamReader(buffer, "8859_1");
			OutputStreamWriter out = new OutputStreamWriter(connection.getOutputStream( ));
			DataOutputStream data = new DataOutputStream(connection.getOutputStream());
			FileInputStream fil = null;
			while(true)
		    {
				String path, att;
				att = "";
				int s;
				int re = 0;
				boolean out1;
				boolean ag;
				while((s = input.read()) != -1){
					ag = out1 = false;
					if ((s >= 32 && s < 127) || s == '\t' || s == '\r' || s == '\n') 
						att += (char)s;
					switch(re)
					{
					case 0:
					case 2:
						if (s == '\r'){
							re++;
							ag = true;
						}
						break;
					case 1:
						if(s == '\n'){
							re++;
							ag = true;
						}
						break;
					case 3:
						out1 = true;
					}
					if(out1)
						break;
					if(ag)
						continue;
					re = 0;
				}
				System.out.flush();
				String headers = "";
				System.out.println(att);
				try {
				    Files.write(Paths.get("log.txt"), (att + "\n\n").getBytes(), StandardOpenOption.APPEND);
				}catch (IOException e) {
				    //exception handling left as an exercise for the reader
				}
				switch(att.split(" ")[0].toUpperCase())
				{
				case "GET":
					try{
						path = att.split(" ")[1];
						String wygb;
						if(path.equals("/") || new File(path.substring(1)).exists())
						{
							wygb = "HTTP/2.0 200 OK\n";
							wygb +="Date: " + new Date().toString() + "\n";
							BufferedReader br = new BufferedReader(new FileReader("response200.txt"));
							String line;
							while (( line = br.readLine()) != null){
								wygb += line + "\n";
							}
							System.out.println(wygb);
							if(path.equalsIgnoreCase("/"))
								fil=new FileInputStream("default.txt");
							else{
								path = path.substring(1);
								fil=new FileInputStream(path);
							}
								
						}
						else
						{
							wygb = "HTTP/2.0 404 Not Found";
							wygb += new Date().toString() + "\n";
							BufferedReader br = new BufferedReader(new FileReader("response404.txt"));
							String line;
							while (( line = br.readLine()) != null){
								wygb += line + "\n";
							}
							fil=new FileInputStream(path);
						}
						String op = "";
						op += wygb;
						int d;
						int len=0;
						String temp = "";
						while((d = fil.read()) != -1)
						{
							temp += (char)d;
							len++;
						}
						op += ("Content-Length: " + len + "\r\n\r\n" + temp);
						input = new InputStreamReader(buffer, "8859_1");
	                	for(int i=0;i<op.length();i++)
	                		out.write(op.charAt(i));
						out.flush();
					}
					catch(Exception ex)
					{
						System.out.println(ex.getMessage());
					}
					break;
				case "OPTIONS":
					out.write("GET POST OPTIONS");
					out.flush();
					break;
				case "POST":
					int lb = 0;
					String[] parts = att.split("\n");
					for(int i=0;i < parts.length;i++)
					{
						String[] name = parts[i].split(" ");
						name[1] = name[1].split("\r")[0];
						if(name[0].equals("Content-Length:")){
							lb = Integer.parseInt(name[1]);
							break;
						}
					}
					
					System.out.println(lb);
					String ge = "";
					int c;
					for(int i=0;i<lb;i++){
						s = input.read();
						ge += (char)s;
					}
					System.out.println(ge);
					try {
					    Files.write(Paths.get("answers.txt"), (ge + "\r\n").getBytes(), StandardOpenOption.APPEND);
					}catch (IOException e) {
					   System.out.println(e.getMessage());
					}
					System.out.println("finished writing");
					path = att.split(" ")[1];
					System.out.println(path);
					String R;
					R = "HTTP/2.0 200 OK\n";
					R +="Date: " + new Date().toString() + "\n";
					BufferedReader br = new BufferedReader(new FileReader("response200-2.txt"));
					String line;
					while (( line = br.readLine()) != null){
						R += line + "\n";
					}
					String o = "";
					o += R;
					int d;
					int len=0;
					String temp = "";
					System.out.println(path);
					try{
					fil = new FileInputStream(path.substring(1));
					}
					catch(Exception ex){
						System.out.println(ex.getMessage());
					}
					while((d = fil.read()) != -1)
					{
						temp += (char)d;
						len++;
					}
					System.out.println(temp);
					o += ("Content-Length: " + len + "\r\n\r\n" + temp);
                	for(int i=0;i<o.length();i++)
                		out.write(o.charAt(i));
					out.flush();
					break;
				case "PUT":
				case "DELETE":
				case "HEAD":
				case "TRACE":
					System.out.println("type not supported");
					connection.close( );
					break;
				default:
					System.out.println("bad Request");
					connection.close( );
					break;
				}
		    }
		}
		catch(Exception ex)
		{
		}
	}
}


