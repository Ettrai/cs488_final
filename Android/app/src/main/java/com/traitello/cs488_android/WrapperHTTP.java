package com.traitello.cs488_android;

import com.traitello.cs488_android.NanoHTTPD.NanoHTTPD;
import com.traitello.cs488_android.NanoHTTPD.ServerRunner;

import java.io.IOException;
import java.util.Map;

public class WrapperHTTP extends NanoHTTPD {

        private String json;

        public WrapperHTTP() throws IOException {
            super(8080);
            start();
        }

        public void setJSON(String JSON){
            this.json = JSON;
        }

        @Override
        public Response serve(IHTTPSession session) {
            Method method = session.getMethod();
            String uri = session.getUri();

            Response myResponse = new Response(this.json);

            myResponse.addHeader("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT");
            myResponse.addHeader("Access-Control-Allow-Origin",  "*");
            myResponse.addHeader("Access-Control-Allow-Headers", "X-Requested-With");
            //System.out.println(this.json);

            /*if (config.getEnableCors()) {
                response.addHeader("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT");
                response.addHeader("Access-Control-Allow-Origin",  "*");
                response.addHeader("Access-Control-Allow-Headers", "X-Requested-With");
            }*/



            return myResponse;
        }

        public static void main(String[] args) {
            ServerRunner.run(WrapperHTTP.class);
        }
    }