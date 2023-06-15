package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.PresignItemVO;
import com.fanglin.data.quotation.vo.PresignProduceVO;
import com.fanglin.utils.Paging;

public interface PresignProduceService {

	public void pagePresignProduce(Paging paging, List<Filter> filters, int company);

	public List<PresignProduceVO> queryPresignProduce(PresignProduceVO presignProduceVO, int company) throws FLException;

	public PresignProduceVO queryPresignProduceByPpid(PresignProduceVO presignProduceVO);

	public int addPresignProduce(PresignProduceVO presignProduceVO, int company) throws FLException;

	public void updatePresignProduce(PresignProduceVO presignProduceVO, List<PresignItemVO> presignItems) throws FLException;

	public int updatePresignProduceForStatus(PresignProduceVO presignProduceVO) throws FLException;

	public void copyPresignProduce(PresignProduceVO presignProduceVO) throws FLException;

}
