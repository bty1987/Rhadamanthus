package com.fanglin.quotation.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.service.QeasureService;
import com.fanglin.quotation.vo.QeasureFunctionAreaVO;
import com.fanglin.quotation.vo.QeasureVO;
import com.fanglin.utils.Paging;

@Service("qeasureService")
@Transactional(readOnly = true)
public class QeasureServiceImpl implements QeasureService {

	@Override
	public void pageQeasure(Paging paging, List<Filter> filters, int company) {
		// TODO Auto-generated method stub

	}

	@Override
	public List<QeasureVO> queryQeasureByOrderId(QeasureVO qeasureVO) throws FLException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public QeasureVO queryQeasureByQmid(QeasureVO qeasureVO) throws FLException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<QeasureFunctionAreaVO> queryQeasureFunctionArea(QeasureFunctionAreaVO qeasureFunctionArea) throws FLException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public QeasureFunctionAreaVO queryQeasureFunctionAreaByQmid(QeasureFunctionAreaVO qeasureFunctionArea) throws FLException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int makeQeasure(QeasureVO qeasureVO, String userId, int company) throws FLException {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public void handleQeasure(QeasureVO qeasureVO) throws FLException {
		// TODO Auto-generated method stub

	}

	@Override
	public void handleQeasureFunctionArea(QeasureFunctionAreaVO qeasureFunctionArea) throws FLException {
		// TODO Auto-generated method stub

	}

}
