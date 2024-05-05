package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.utils.Paging;

public interface CompanyService {

	public void pageCompany(Paging paging, List<Filter> filters) throws FLException;

	public List<CompanyVO> queryCompany(CompanyVO companyVO) throws FLException;

	public CompanyVO queryCompanyByCid(CompanyVO companyVO) throws FLException;

	public CompanyVO validateCompany(CompanyVO companyVO) throws FLException;

	public int createCompany(CompanyVO companyVO, String securityCode, String verifyCode) throws FLException;

	public int addCompany(CompanyVO companyVO) throws FLException;

	public int updateCompany(CompanyVO companyVO) throws FLException;

	public int updateCompanyForStatus(CompanyVO companyVO) throws FLException;
}
