package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.production.dao.ProductionPictureDao;
import com.fanglin.production.po.ProductionPicturePO;
import com.fanglin.production.service.ProductionPictureService;
import com.fanglin.production.vo.ProductionPictureVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("productionPictureService")
@Transactional(readOnly = true)
public class ProductionPictureServiceImpl implements ProductionPictureService {
	
	@Autowired
	private ProductionPictureDao productionPictureDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public List<ProductionPictureVO> queryProductionPictureByPid(ProductionPictureVO productionPictureVO) {
		
		List<ProductionPicturePO> productionPicturePOs = new ArrayList<ProductionPicturePO>();
		List<ProductionPictureVO> productionPictureVOs = new ArrayList<ProductionPictureVO>();
		
		productionPicturePOs = productionPictureDao.queryProductionPictureByPid(productionPictureVO.getPid());
		
		ProductionPictureVO _productionPictureVO;
		
		for(ProductionPicturePO productionPicturePO:productionPicturePOs){
			
			_productionPictureVO = new ProductionPictureVO(new UserBaseVO()); 
			
			BeanUtil.copyProperties(productionPicturePO, _productionPictureVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(productionPicturePO.getCreater(),_productionPictureVO.getCreater(),Arrays.asList("duty","dept"));
			
			productionPictureVOs.add(_productionPictureVO);
			
		}
		
		return productionPictureVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addProductionPicture(ProductionPictureVO productionPictureVO,String userId) throws FLException{
		
		ProductionPicturePO productionPicturePO = new ProductionPicturePO(new UserPO());
		
		UserPO creater = userDao.queryUserByUserId(userId);
		
		BeanUtil.copyProperties(productionPictureVO, productionPicturePO, Arrays.asList("creater"));
		BeanUtil.copyProperties(creater, productionPicturePO.getCreater(), Arrays.asList("role","dept","duty"));
		
		productionPicturePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		productionPicturePO.setStatus(productionPictureVO.getStatus());
		
		productionPictureDao.save(productionPicturePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteProductionPicture(ProductionPictureVO productionPictureVO) throws FLException{
		
		ProductionPicturePO productionPicturePO = productionPictureDao.get(productionPictureVO.getPpid());
		
		if(productionPicturePO == null){
			throw new FLException(220003 ,"图纸不存在");
		}
		
		productionPictureDao.delete(productionPicturePO);	
		
		return 0;
	}

}
