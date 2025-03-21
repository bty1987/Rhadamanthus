package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.InspectVO;
import com.fanglin.utils.Paging;

public interface InspectService {

	public void pageInspect(Paging paging, List<Filter> filters);

	public List<InspectVO> queryInspect(InspectVO inspectVO);

	public void addInspect(InspectVO inspectVO, int company);

	public void updateInspect(InspectVO inspectVO) throws FLException;

	public void updateInspectForStatus(InspectVO inspectVO) throws FLException;

}
