package com.fanglin.production.service;

import java.util.List;



import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.vo.ProductionPictureVO;

public interface ProductionPictureService {
	
	public List<ProductionPictureVO> queryProductionPictureByPid(ProductionPictureVO productionPictureVO);

	public int addProductionPicture(ProductionPictureVO productionPictureVO, String userId) throws FLException;
	
	public int deleteProductionPicture(ProductionPictureVO productionPictureVO) throws FLException;
}
