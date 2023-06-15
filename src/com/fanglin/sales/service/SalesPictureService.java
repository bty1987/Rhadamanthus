package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.vo.SalesPictureVO;

public interface SalesPictureService {

	public List<SalesPictureVO> querySalesPicture(SalesPictureVO salesPictureVO);

	public int addSalesPicture(SalesPictureVO salesPictureVO, String userId, int company) throws FLException;

	public int deleteSalesPicture(SalesPictureVO salesPictureVO);

}
