package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QeasureFunctionAreaVO;
import com.fanglin.quotation.vo.QeasureVO;

public interface QeasureFunctionAreaService {

	public List<QeasureFunctionAreaVO> queryQeasureFunctionArea(QeasureFunctionAreaVO qeasureFunctionAreaVO);

	public QeasureFunctionAreaVO queryQeasureFunctionAreaByQmfaId(QeasureFunctionAreaVO qeasureFunctionAreaVO);

	public int makeQeasureFunctionArea(QeasureVO qeasureVO, QeasureFunctionAreaVO qeasureFunctionAreaVO) throws FLException;

	public int handleQeasureFunctionArea(QeasureVO qeasureVO, QeasureFunctionAreaVO qeasureFunctionAreaVO) throws FLException;

	public int deleteQeasureFunctionArea(QeasureFunctionAreaVO qeasureFunctionAreaVO);

}
