package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerOriginVO;
import com.fanglin.utils.Paging;

public interface CustomerOriginService {

	public void pageCustomerOrigin(Paging paging, List<Filter> filters, String userId, String user);

	public void pageCustomerOriginForAdvance(Paging paging, List<Filter> filters, String userId);

	public CustomerOriginVO queryCustomerOriginByCsid(CustomerOriginVO customerOrigin) throws FLException;

	public void addCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException;

	public void updateCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException;

	public void updateCustomerOriginForBelonger(CustomerOriginVO customerOriginVO, String userId) throws FLException;

	public void freeCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException;

	public void takeCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException;

	public void bindCustomerOrigin(CustomerOriginVO customerOrigin, String userId, int company) throws FLException;

	public void commitCustomerOrigin(CustomerOriginVO customerOrigin) throws FLException;

	public void confirmCustomerOrigin(CustomerOriginVO customerOrigin, String securityCode, String verifyCode, String phoneCode, String company) throws FLException;

	public void cancelCustomerOrigin(CustomerOriginVO customerOrigin) throws FLException;

	/**
	 * 客源初审通过（直接接口，不走审批流程）
	 * 对应 approveForCustomerSource 的业务逻辑
	 * @param customerOrigin 客源数据
	 * @param company 公司ID
	 * @throws FLException
	 */
	public void approveCustomerOrigin(CustomerOriginVO customerOrigin, int company) throws FLException;

	/**
	 * 客源转装修单（直接接口，不走审批流程）
	 * 对应 approveForCustomerOriginTDecoration 的业务逻辑
	 * @param customerOrigin 客源数据（包含 type, typeness, houseType, houseClass, resourceType 等转单参数）
	 * @param company 公司ID
	 * @throws FLException
	 */
	public void tranCustomerOrigin(CustomerOriginVO customerOrigin, int company) throws FLException;

}
