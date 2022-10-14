package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.FlowitemVO;
import com.fanglin.data.common.vo.FlowpathVO;

public interface FlowitemService {

	public List<FlowitemVO> queryFlowitem(FlowitemVO flowitemVO);

	public int addFlowitem(FlowpathVO flowpathVO, List<FlowitemVO> flowitemVOs) throws FLException;

	public int deleteFlowItem(FlowitemVO flowitemVO) throws FLException;

}
