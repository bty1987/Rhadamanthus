package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QeasureFunctionAreaVO;
import com.fanglin.quotation.vo.QeasureVO;
import com.fanglin.utils.Paging;

public interface QeasureService {

	public void pageQeasure(Paging paging, List<Filter> filters, int company);

	public List<QeasureVO> queryQeasureByOrderId(QeasureVO qeasureVO) throws FLException;

	public QeasureVO queryQeasureByQmid(QeasureVO qeasureVO) throws FLException;

	public List<QeasureFunctionAreaVO> queryQeasureFunctionArea(QeasureFunctionAreaVO qeasureFunctionArea) throws FLException;

	public QeasureFunctionAreaVO queryQeasureFunctionAreaByQmid(QeasureFunctionAreaVO qeasureFunctionArea) throws FLException;

	public int makeQeasure(QeasureVO qeasureVO, String userId, int company) throws FLException;

	public void handleQeasure(QeasureVO qeasureVO) throws FLException;

	public void handleQeasureFunctionArea(QeasureFunctionAreaVO qeasureFunctionArea) throws FLException;

}
