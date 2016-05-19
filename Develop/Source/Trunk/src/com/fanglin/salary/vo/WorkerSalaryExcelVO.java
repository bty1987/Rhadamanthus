/**
 * @File Name		: WorkerSalaryExcelVO.java
 * @Package   	: com.fanglin.vo.salary
 * @Version		: 1.0
 * @Date			: 2014-11-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.vo;

import java.io.Serializable;

public class WorkerSalaryExcelVO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -3388957923653804743L;
	
	public static String SUBJECT_NAME_TYPE_WORKER_SALARY_STR = "工人工资";
	
	public static String CURRENCY_CODE_RMB_STR = "RMB";
	
	public static String CURRENCY_NAME_RMB_STR = "人民币";
	
	private String voucherData;
	
	private String subjectName;
	
	private String currencyCode;
	
	private String currencyName;
	
	private float originalAmount;
	
	private float debit;
	
	private float credit;
	
	private String workerName;
	
	private String workerId;
	
	private String balanceProject;

	public String getVoucherData(){
		return voucherData;
	}

	public void setVoucherData(String voucherData){
		this.voucherData = voucherData;
	}

	public String getSubjectName(){
		return subjectName;
	}

	public void setSubjectName(String subjectName){
		this.subjectName = subjectName;
	}

	public String getCurrencyCode(){
		return currencyCode;
	}

	public void setCurrencyCode(String currencyCode){
		this.currencyCode = currencyCode;
	}

	public String getCurrencyName(){
		return currencyName;
	}

	public void setCurrencyName(String currencyName){
		this.currencyName = currencyName;
	}

	public float getOriginalAmount(){
		return originalAmount;
	}

	public void setOriginalAmount(float originalAmount){
		this.originalAmount = originalAmount;
	}

	public float getDebit(){
		return debit;
	}

	public void setDebit(float debit){
		this.debit = debit;
	}

	public float getCredit(){
		return credit;
	}

	public void setCredit(float credit){
		this.credit = credit;
	}

	public String getWorkerName(){
		return workerName;
	}

	public void setWorkerName(String workerName){
		this.workerName = workerName;
	}

	public String getWorkerId(){
		return workerId;
	}

	public void setWorkerId(String workerId){
		this.workerId = workerId;
	}

	public String getBalanceProject(){
		return balanceProject;
	}

	public void setBalanceProject(String balanceProject){
		this.balanceProject = balanceProject;
	}
	
}
