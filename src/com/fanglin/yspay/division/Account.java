package com.fanglin.yspay.division;


public class Account {

	public static String CHARGEFEE_COLLECT_STR = "01";

	public static String CHARGEFEE_FREE_STR = "02";

	private String division_mer_usercode;

	private Double div_amount;

	private Double div_ratio;

	private String is_chargeFee;

	public Account(String division_mer_usercode, Double div_amount, Double div_ratio, String is_chargeFee) {
		super();
		this.division_mer_usercode = division_mer_usercode;
		this.div_amount = div_amount;
		this.div_ratio = div_ratio;
		this.is_chargeFee = is_chargeFee;
	}

	public Account(String division_mer_usercode, Double value, String is_chargeFee, String division_mode) {
		super();

		this.division_mer_usercode = division_mer_usercode;
		this.is_chargeFee = is_chargeFee;

		if (Business.DIVISION_MODE_AMOUNT_STR.equals(division_mode)) {
			this.div_amount = value;
		} else if (Business.DIVISION_MODE_RATE_STR.equals(division_mode)) {
			this.div_ratio = value;
		}
	}

	public String getDivision_mer_usercode() {
		return division_mer_usercode;
	}

	public void setDivision_mer_usercode(String division_mer_usercode) {
		this.division_mer_usercode = division_mer_usercode;
	}

	public Double getDiv_amount() {
		return div_amount;
	}

	public void setDiv_amount(Double div_amount) {
		this.div_amount = div_amount;
	}

	public Double getDiv_ratio() {
		return div_ratio;
	}

	public void setDiv_ratio(Double div_ratio) {
		this.div_ratio = div_ratio;
	}

	public String getIs_chargeFee() {
		return is_chargeFee;
	}

	public void setIs_chargeFee(String is_chargeFee) {
		this.is_chargeFee = is_chargeFee;
	}

	public String pack() {

		return "";
	}

}
