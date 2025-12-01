package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QeasureVO;
import com.fanglin.utils.Paging;

public interface QeasureService {

	public void pageQeasure(Paging paging, List<Filter> filters, int company);

	public QeasureVO queryQeasureByOrderId(QeasureVO qeasureVO) throws FLException;

	public QeasureVO queryQeasureByQmid(QeasureVO qeasureVO) throws FLException;

	public int makeQeasure(QeasureVO qeasureVO, String userId, int company) throws FLException;

	public void handleQeasure(QeasureVO qeasureVO) throws FLException;

}
