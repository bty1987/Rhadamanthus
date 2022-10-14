package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.FlowpathVO;
import com.fanglin.utils.Paging;

public interface FlowpathService {

	public void pageFlowpath(Paging paging, List<Filter> filters);

	public List<FlowpathVO> queryFlowpath(FlowpathVO flowpathVO);

	public int addFlowpath(FlowpathVO flowpathVO) throws FLException;

	public int updateFlowpath(FlowpathVO flowpathVO) throws FLException;

	public int deleteFlowpath(FlowpathVO flowpathVO) throws FLException;

}
