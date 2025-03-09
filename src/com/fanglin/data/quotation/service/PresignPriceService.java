package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.PresignPriceVO;
import com.fanglin.utils.Paging;

public interface PresignPriceService {

	public void pagePresignPrice(Paging paging, List<Filter> filters, PresignPriceVO presignPriceVO);

	public PresignPriceVO queryPresignPrice(PresignPriceVO presignPriceVO);

	public int addPresignPrice(PresignPriceVO presignPriceVO);

	public int updatePresignPrice(PresignPriceVO presignPriceVO) throws FLException;

	public int updatePresignPriceForStatus(PresignPriceVO presignPriceVO) throws FLException;

	public int deletePresignPrice(PresignPriceVO presignPriceVO);

}
