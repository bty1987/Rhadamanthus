package com.yspay.division;

import java.util.Map;

import com.google.gson.Gson;
import com.yspay.bean.Base;
import com.yspay.bean.Business;
import com.yspay.bean.Response;
import com.yspay.config.Config;
import com.yspay.utils.HttpClientUtil;
import com.yspay.utils.SignUtils;

public class Division {

	private Base base;

	private Map<String, String> param;

	private String url;

	public Division regist(Base base) {

		base.setMethod("ysepay.merchant.register.query");

		this.base = base;
		this.url = Config.DIVISION_URL;
		this.param = base.division();

		return this;
	}

	public Division query(Base base) {

		// base.setMethod("ysepay.single.division.online.query");
		base.setMethod("ysepay.single.division.offline.query");

		this.base = base;
		this.url = Config.DIVISION_URL;
		this.param = base.division();

		return this;
	}

	public Division division(Base base) {

		// base.setMethod("ysepay.single.division.online.accept");
		base.setMethod("ysepay.single.division.offline.accept");
		base.getBusiness().setIs_divistion(Business.DIVISION_YES_STR);
		base.getBusiness().setIs_again_division(Business.REDIVISION_NO_STR);

		this.base = base;
		this.url = Config.DIVISION_URL;
		this.param = base.division();

		return this;
	}

	public Division redivision(Base base) {

		// base.setMethod("ysepay.single.division.online.accept");
		base.setMethod("ysepay.single.division.offline.accept");
		base.getBusiness().setIs_divistion(Business.DIVISION_YES_STR);
		base.getBusiness().setIs_again_division(Business.REDIVISION_YES_STR);

		this.base = base;
		this.url = Config.DIVISION_URL;
		this.param = base.division();

		return this;
	}

	public Division refund(Base param) {

		base.setMethod("ysepay.online.trade.refund.split");

		this.param = param.refund();
		this.url = Config.DIVISION_URL;
		this.param = base.refund();

		return this;
	}

	public Response execute() {

		String result = HttpClientUtil.sendPost(this.url, this.param);
		Response response = new Gson().fromJson(result, Response.class);

		System.out.println(result);

		return response.init();
	}

	public Response verify(Map<String, String> params, String sign) {

		Response response = null;

		if (SignUtils.rsaCheckContent(params, sign, "UTF-8")) {
			response = new Response("00", "");
		} else {
			response = new Response("01", "");
		}

		return response;
	}

	public static void main(String[] args) {

		// query

		Base base = new Base("826235152110030", "");

		base.setBusiness(new Business("826235152110030", "751998037096"));

		Response response = new Division().query(base).execute();

		System.out.println(response.getCode());

		// division

		// Base base = new Base("826235152110030", "http://223.100.27.233:30080/divisionCallback.do?authentication=eX3o2SZdrpVOV9HC4UYTRA==");
		//
		// base.setBusiness(new Business("826235152110030", "751998037096", 0.1, Business.DIVISION_MODE_AMOUNT_STR, "20191012"));
		//
		// base.addAccount("826221789120030", 0.05, Account.CHARGEFEE_COLLECT_STR);
		// base.addAccount("826235189120027", 0.05, Account.CHARGEFEE_FREE_STR);
		//
		// Response response = new Division().redivision(base).execute();
		//
		// System.out.println(response.getReturnCode());
		// System.out.println(response.getReturnInfo());

		// refund

		// Base base = new Base("826235152110030", "");
		//
		// base.setBusiness(new Business("1569891385269", 0.2, "分账退款交易", Business.DIVISION_YES_STR, Business.DIVISION_MODE_AMOUNT_STR));
		// base.setRefund(new Refund("826221789120030", 0.1));
		//
		// base.addAccount("826221789120030", 0.1, Account.CHARGEFEE_COLLECT_STR);
		// base.addAccount("826235189120027", 0.1, Account.CHARGEFEE_FREE_STR);
		//
		// Response response = new Division().refund(base).execute();
		//
		// System.out.println(response.getCode());

	}

}
