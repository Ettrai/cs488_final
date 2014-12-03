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

            //System.out.println(this.json);

            return new NanoHTTPD.Response(this.json);
        }

        public static void main(String[] args) {
            ServerRunner.run(WrapperHTTP.class);
        }
    }