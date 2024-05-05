package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.QualiterVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface QualiterService {

	public void pageConstructionForQualiter(Paging paging, List<Filter> filters, String userId) throws FLException;

	public List<QualiterVO> queryQualiter(QualiterVO qualiter);

	public void addQualiter(QualiterVO qualiter, String createrId) throws FLException;

	public void deleteQualiter(QualiterVO qualiter) throws FLException;

}
