package com.fanglin.utils;

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

import java.math.BigDecimal;
import java.math.BigInteger;

public class Arith {

	public static final int ROUND_UP = BigDecimal.ROUND_UP;
	public static final int ROUND_DOWN = BigDecimal.ROUND_DOWN;
	public static final int ROUND_CEILING = BigDecimal.ROUND_CEILING;
	public static final int ROUND_FLOOR = BigDecimal.ROUND_FLOOR;
	public static final int ROUND_HALF_UP = BigDecimal.ROUND_HALF_UP;
	public static final int ROUND_HALF_DOWN = BigDecimal.ROUND_HALF_DOWN;

	private static final int DEF_SCALE = 3;

	private Arith() {
	}

	public static int add(int v1, int v2) {
		BigDecimal b1 = new BigDecimal(v1).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(v2).setScale(DEF_SCALE);
		return b1.add(b2).intValue();
	}

	public static long add(long v1, long v2) {
		BigDecimal b1 = new BigDecimal(v1).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(v2).setScale(DEF_SCALE);
		return b1.add(b2).longValue();
	}

	public static BigInteger add(BigInteger v1, BigInteger v2) {
		return v1.add(v2);
	}

	public static float add(float v1, float v2) {

		BigDecimal b1 = round(new BigDecimal(Float.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Float.toString(v2)), DEF_SCALE);

		return b1.add(b2).floatValue();
	}

	public static double add(double v1, double v2) {

		BigDecimal b1 = round(new BigDecimal(Double.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Double.toString(v2)), DEF_SCALE);

		return b1.add(b2).doubleValue();
	}

	public static int sub(int v1, int v2) {

		BigDecimal b1 = new BigDecimal(v1).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(v2).setScale(DEF_SCALE);

		return b1.subtract(b2).intValue();
	}

	public static long sub(long v1, long v2) {

		BigDecimal b1 = new BigDecimal(v1).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(v2).setScale(DEF_SCALE);

		return b1.subtract(b2).longValue();
	}

	public static BigInteger sub(BigInteger v1, BigInteger v2) {
		return v1.subtract(v2);
	}

	public static float sub(float v1, float v2) {

		BigDecimal b1 = round(new BigDecimal(Float.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Float.toString(v2)), DEF_SCALE);

		return b1.subtract(b2).floatValue();
	}

	public static double sub(double v1, double v2) {

		BigDecimal b1 = round(new BigDecimal(Double.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Double.toString(v2)), DEF_SCALE);

		return b1.subtract(b2).doubleValue();
	}

	public static int mul(int v1, int v2) {

		BigDecimal b1 = new BigDecimal(v1).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(v2).setScale(DEF_SCALE);

		BigDecimal scale = new BigDecimal(Math.pow(10, DEF_SCALE));

		return b1.multiply(b2).divide(scale).intValue();
	}

	public static long mul(long v1, long v2) {

		BigDecimal b1 = new BigDecimal(v1).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(v2).setScale(DEF_SCALE);

		BigDecimal scale = new BigDecimal(Math.pow(10, DEF_SCALE));

		return b1.multiply(b2).divide(scale).longValue();
	}

	public static BigInteger mul(BigInteger v1, BigInteger v2) {

		BigInteger scale = new BigInteger(Long.toString(Double.valueOf(Math.pow(10, DEF_SCALE)).longValue()));

		return v1.multiply(v2).divide(scale);
	}

	public static float mul(float v1, float v2) {

		BigDecimal b1 = round(new BigDecimal(Float.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Float.toString(v2)), DEF_SCALE);

		return round(b1.multiply(b2), DEF_SCALE).floatValue();
	}

	public static double mul(double v1, double v2) {
		BigDecimal b1 = round(new BigDecimal(Double.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Double.toString(v2)), DEF_SCALE);
		return round(b1.multiply(b2), DEF_SCALE).doubleValue();
	}

	public static int div(int v1, int v2) {
		BigDecimal b1 = new BigDecimal(v1).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(v2).setScale(DEF_SCALE);

		BigDecimal scale = new BigDecimal(Math.pow(10, DEF_SCALE));

		return b1.divide(b2, DEF_SCALE).multiply(scale).intValue();
	}

	public static int div(int v1, int v2, int round) {
		BigDecimal b1 = new BigDecimal(v1).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(v2).setScale(DEF_SCALE);

		BigDecimal scale = new BigDecimal(Math.pow(10, DEF_SCALE));

		return b1.divide(b2, DEF_SCALE, round).multiply(scale).intValue();
	}

	public static long div(long v1, long v2) {

		BigDecimal b1 = new BigDecimal(v1).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(v2).setScale(DEF_SCALE);

		BigDecimal scale = new BigDecimal(Math.pow(10, DEF_SCALE));

		return b1.divide(b2, DEF_SCALE).multiply(scale).longValue();
	}

	public static long div(long v1, long v2, int round) {

		BigDecimal b1 = new BigDecimal(v1).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(v2).setScale(DEF_SCALE);

		BigDecimal scale = new BigDecimal(Math.pow(10, DEF_SCALE));

		return b1.divide(b2, DEF_SCALE, round).multiply(scale).longValue();
	}

	public static BigInteger div(BigInteger v1, BigInteger v2) {

		BigInteger scale = new BigInteger(Long.toString(Double.valueOf(Math.pow(10, DEF_SCALE)).longValue()));

		return v1.multiply(scale).divide(v2);
	}

	public static float div(float v1, float v2) {

		BigDecimal b1 = round(new BigDecimal(Float.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Float.toString(v2)), DEF_SCALE);

		return b1.divide(b2, DEF_SCALE).floatValue();
	}

	public static double div(double v1, double v2) {

		BigDecimal b1 = round(new BigDecimal(Double.toString(v1)), DEF_SCALE);
		BigDecimal b2 = round(new BigDecimal(Double.toString(v2)), DEF_SCALE);

		return b1.divide(b2, DEF_SCALE).doubleValue();
	}

	public static int round(int v, int scale, int type) {

		BigDecimal b1 = new BigDecimal(v).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(Math.pow(10, DEF_SCALE));

		return b1.divide(b2, scale, type).multiply(b2).intValue();
	}

	public static long round(long v, int scale, int type) {

		BigDecimal b1 = new BigDecimal(v).setScale(DEF_SCALE);
		BigDecimal b2 = new BigDecimal(Math.pow(10, DEF_SCALE));

		return b1.divide(b2, scale, type).multiply(b2).longValue();
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

		System.out.println();

		long vv1 = 9999999999L;
		long vv2 = 111;

		System.out.println(Arith.add(vv1, vv2));
		System.out.println(Arith.sub(vv1, vv2));
		System.out.println(Arith.mul(vv1, vv2));
		System.out.println(Arith.div(vv1, vv2));

		int vvv = 999999999;

		System.out.println(vvv);

		System.out.println(Arith.div(909090, 1100));
		System.out.println(Arith.div(Arith.div(909090, 1100), 1000000));
		System.out.println(Arith.mul(Arith.div(Arith.div(909090, 1100), 1000000), 1000000));

		System.out.println(Arith.mul(Arith.div(1111, 1000000), 1000000));

		System.out.println(Arith.round(13134, 0, BigDecimal.ROUND_FLOOR));

		System.out.println(Arith.round(-4400l, 0, BigDecimal.ROUND_HALF_UP));
	}
};