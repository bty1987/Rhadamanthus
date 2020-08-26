package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.ConsultionVO;
import com.fanglin.utils.Paging;

public interface ConsultionService {

	public void pageConsultion(Paging paging, List<Filter> filters, String userId);

	public List<ConsultionVO> queryConsultionByOrderId(ConsultionVO consultion);

	public void addConsultion(ConsultionVO consultion, String userId, int company) throws FLException;

}
