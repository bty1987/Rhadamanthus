/**
 * @File Name		: A.java
 * @Package   	: com.fanglin.utils
 * @Version		: 1.0
 * @Date			: 2014-10-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.utils;

import java.math.BigDecimal;
import java.math.BigInteger;

public class Arith {

	private static final int DEF_SCALE = 3;

	private Arith() {
	}

	public static BigInteger add(BigInteger v1, BigInteger v2) {
		return v1.add(v2);
	}

	public static int add(int v1, int v2) {
		BigDecimal b1 = new BigDecimal(Float.toString(v1)).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(Float.toString(v2)).setScale(DEF_SCALE);
		return b1.add(b2).intValue();
	}

	public static float add(float v1, float v2) {
		BigDecimal b1 = round(new BigDecimal(Double.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Double.toString(v2)), DEF_SCALE);
		return b1.add(b2).floatValue();
	}

	public static double add(double v1, double v2) {
		BigDecimal b1 = round(new BigDecimal(Double.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Double.toString(v2)), DEF_SCALE);
		return b1.add(b2).doubleValue();
	}

	public static BigInteger sub(BigInteger v1, BigInteger v2) {
		return v1.subtract(v2);
	}

	public static int sub(int v1, int v2) {
		BigDecimal b1 = new BigDecimal(Float.toString(v1)).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(Float.toString(v2)).setScale(DEF_SCALE);
		return b1.subtract(b2).intValue();
	}

	public static float sub(float v1, float v2) {
		BigDecimal b1 = round(new BigDecimal(Double.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Double.toString(v2)), DEF_SCALE);
		return b1.subtract(b2).floatValue();
	}

	public static double sub(double v1, double v2) {
		BigDecimal b1 = round(new BigDecimal(Double.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Double.toString(v2)), DEF_SCALE);
		return b1.subtract(b2).doubleValue();
	}

	public static BigInteger mul(BigInteger v1, BigInteger v2) {

		BigInteger scale = new BigInteger(Long.toString(Double.valueOf(Math.pow(10, DEF_SCALE)).longValue()));

		return v1.multiply(v2).divide(scale);
	}

	public static int mul(int v1, int v2) {
		BigDecimal b1 = new BigDecimal(Double.toString(v1)).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(Double.toString(v2)).setScale(DEF_SCALE);

		BigDecimal scale = new BigDecimal(Double.toString(Math.pow(10, DEF_SCALE)));

		return b1.multiply(b2).divide(scale).intValue();
	}

	public static float mul(float v1, float v2) {
		BigDecimal b1 = round(new BigDecimal(Double.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Double.toString(v2)), DEF_SCALE);
		return round(b1.multiply(b2), DEF_SCALE).floatValue();
	}

	public static double mul(double v1, double v2) {
		BigDecimal b1 = round(new BigDecimal(Double.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Double.toString(v2)), DEF_SCALE);
		return round(b1.multiply(b2), DEF_SCALE).doubleValue();
	}

	public static BigInteger div(BigInteger v1, BigInteger v2) {

		BigInteger scale = new BigInteger(Long.toString(Double.valueOf(Math.pow(10, DEF_SCALE)).longValue()));

		return v1.multiply(scale).divide(v2);
	}

	public static int div(int v1, int v2) {
		BigDecimal b1 = new BigDecimal(Double.toString(v1)).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(Double.toString(v2)).setScale(DEF_SCALE);

		BigDecimal scale = new BigDecimal(Double.toString(Math.pow(10, DEF_SCALE)));

		return b1.divide(b2, DEF_SCALE).multiply(scale).intValue();
	}

	public static float div(float v1, float v2) {
		BigDecimal b1 = round(new BigDecimal(Double.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Double.toString(v2)), DEF_SCALE);
		return b1.divide(b2, DEF_SCALE).floatValue();
	}

	public static double div(double v1, double v2) {
		BigDecimal b1 = round(new BigDecimal(Double.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Double.toString(v2)), DEF_SCALE);
		return b1.divide(b2, DEF_SCALE).doubleValue();
	}

	public static double round(double v, int scale) {
		BigDecimal b = new BigDecimal(Double.toString(v));
		BigDecimal one = new BigDecimal("1");
		return b.divide(one, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
	}

	public static float round(float v, int scale) {
		BigDecimal b = new BigDecimal(Float.toString(v));
		BigDecimal one = new BigDecimal("1");
		return b.divide(one, scale, BigDecimal.ROUND_HALF_UP).floatValue();
	}

	public static BigDecimal round(BigDecimal v, int scale) {
		BigDecimal one = new BigDecimal("1");
		return v.divide(one, scale, BigDecimal.ROUND_HALF_UP);
	}

	public static void main(String[] args) {

		System.out.println(Arith.add(1234, 4321));
		System.out.println(Arith.sub(1234, 4321));
		System.out.println(Arith.mul(1234, 4321));
		System.out.println(Arith.div(1234, 4321));

		System.out.println();

		System.out.println(Arith.add(1.234f, 4.321f));
		System.out.println(Arith.sub(1.234f, 4.321f));
		System.out.println(Arith.mul(1.234f, 4.321f));
		System.out.println(Arith.div(1.234f, 4.321f));

		System.out.println();

		System.out.println(Arith.add(1.234, 4.321));
		System.out.println(Arith.sub(1.234, 4.321));
		System.out.println(Arith.mul(1.234, 4.321));
		System.out.println(Arith.div(1.234, 4.321));

		System.out.println();

		BigInteger v1 = new BigInteger("12500");
		BigInteger v2 = new BigInteger("100");

		System.out.println(Arith.add(v1, v2));
		System.out.println(Arith.sub(v1, v2));
		System.out.println(Arith.mul(v1, v2));
		System.out.println(Arith.div(v1, v2));

	}
};