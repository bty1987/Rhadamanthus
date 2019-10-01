package com.yspay.division;

import java.util.Map;

import com.google.gson.Gson;
import com.yspay.bean.Account;
import com.yspay.bean.Base;
import com.yspay.bean.Business;
import com.yspay.bean.Response;
import com.yspay.config.Config;
import com.yspay.utils.HttpClientUtil;

/**
 * @author liuj
 * @description 分账登记
 * @date 2019-2-26
 */
public class Division {

	private Base base;

	private Map<String, String> param;

	private String url;

	public static void main(String[] args) {

		Base base = new Base("ysepay.single.division.online.accept", "826235152110030", "");

		base.setBusiness(new Business("826235152110030", "1569891385269", 0.2, Business.DIVISION_MODE_AMOUNT_STR));

		base.addAccount("826221789120030", 0.1, Account.CHARGEFEE_COLLECT_STR);
		base.addAccount("826235189120027", 0.1, Account.CHARGEFEE_FREE_STR);

		Response response = new Division().division(base).execute();

		System.out.println(response.getSign());
		System.out.println(response.getCode());

		// refund

		// Base base = new Base("ysepay.single.division.online.accept", "826235152110030", "");
		//
		// base.setBusiness(new Business("1569891385269", 0.2, "分账退款交易", Business.DIVISION_YES_STR, Business.DIVISION_MODE_AMOUNT_STR));
		// base.setRefund(new Refund("826221789120030", 0.1));
		//
		// base.addAccount("826221789120030", 0.1, Account.CHARGEFEE_COLLECT_STR);
		// base.addAccount("826235189120027", 0.1, Account.CHARGEFEE_FREE_STR);
		//
		// Division division = new Division().refund(base).execute();

	}

	public Division query(Base base) {

		this.base = base;
		this.url = Config.DIVISION_URL;
		this.param = base.division();

		return this;
	}

	public Division division(Base base) {

		base.getBusiness().setIs_divistion(Business.DIVISION_YES_STR);
		base.getBusiness().setIs_again_division(Business.REDIVISION_NO_STR);

		this.base = base;
		this.url = Config.DIVISION_URL;
		this.param = base.division();

		return this;
	}

	public Division redivision(Base base) {

		base.getBusiness().setIs_divistion(Business.DIVISON_NO_STR);
		base.getBusiness().setIs_again_division(Business.REDIVISION_YES_STR);

		this.base = base;
		this.url = Config.DIVISION_URL;
		this.param = base.division();

		return this;
	}

	public Division refund(Base param) {

		this.param = param.refund();
		this.url = Config.DIVISION_URL;
		this.param = base.refund();

		return this;
	}

	public Response execute() {

		String result = HttpClientUtil.sendPost(this.url, this.param);
		Response response = new Gson().fromJson(result, Response.class);

		return response.init();
	}
}
