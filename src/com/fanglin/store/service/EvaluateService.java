package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.vo.EvaluateVO;
import com.fanglin.store.vo.MorderVO;
import com.fanglin.store.vo.MuserVO;
import com.fanglin.utils.Paging;

public interface EvaluateService {

	public void pageEvaluate(Paging paging, List<Filter> filters);

	public int addEvaluate(List<EvaluateVO> evaluates, MuserVO muser, MorderVO morder) throws FLException;

}
