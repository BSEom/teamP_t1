package com.pknu.mini_project.controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class OracleConnectionTest {
    public static void main(String[] args) {
        System.setProperty("user.timezone", "Asia/Seoul");

        String url = "jdbc:oracle:thin:@172.17.0.2:1521:xe";
        String user = "price";
        String password = "12345";

        try {
            Class.forName("oracle.jdbc.OracleDriver");
            System.out.println("JDBC URL: " + url);

            Connection con = DriverManager.getConnection(url, user, password);
            Statement stmt = con.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM USERS");

            if (rs.next()) {
                System.out.println("USERS 테이블 행 수: " + rs.getInt(1));
            }

            rs.close();
            stmt.close();
            con.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
