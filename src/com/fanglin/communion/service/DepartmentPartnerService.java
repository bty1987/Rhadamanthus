package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.DepartmentPartnerVO;
import com.fanglin.core.interceptor.FLException;

public interface DepartmentPartnerService {

	public List<DepartmentPartnerVO> queryDepartmentPartner(DepartmentPartnerVO departmentPartnerVO) throws FLException;

	public int addDepartmentPartner(DepartmentPartnerVO departmentPartnerVO, int company) throws FLException;

	public int deleteDepartmentPartner(DepartmentPartnerVO departmentPartnerVO) throws FLException;

}
