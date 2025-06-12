package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ConstructionPeriodNodeVO;

public interface ConstructionPeriodNodeService {

	public List<ConstructionPeriodNodeVO> queryConstructionPeriodNodeByCpid(ConstructionPeriodNodeVO constructionPeriodNode) throws FLException;

	public void addConstructionPeriodNode(ConstructionPeriodNodeVO constructionPeriodNode);

	public int deleteConstructionPeriodNodeByCpnid(ConstructionPeriodNodeVO constructionPeriodNode);

}
