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
import com.fanglin.production.dao.ProductionDao;
import com.fanglin.production.dao.ProductionPictureDao;
import com.fanglin.production.po.ProductionPO;
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
	private ProductionDao productionDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<ProductionPictureVO> queryProductionPictureByPid(ProductionPictureVO productionPictureVO) {

		List<ProductionPicturePO> productionPicturePOs = productionPictureDao.queryProductionPictureByPid(productionPictureVO.getPid());
		List<ProductionPictureVO> productionPictureVOs = new ArrayList<ProductionPictureVO>();

		for (ProductionPicturePO productionPicturePO : productionPicturePOs) {

			productionPictureVO = new ProductionPictureVO(new UserBaseVO());

			BeanUtil.copyProperties(productionPicturePO, productionPictureVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(productionPicturePO.getCreater(), productionPictureVO.getCreater(), Arrays.asList("duty", "dept"));

			productionPictureVOs.add(productionPictureVO);

		}

		return productionPictureVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addProductionPicture(ProductionPictureVO productionPictureVO, String userId) throws FLException {
        ProductionPO production = productionDao.get(productionPictureVO.getPid());
        
		if(production == null){
			throw new FLException(220001, "生产单不存在");
		}
		
		if(production.getStatus() != ProductionPO.STATUS_SIGNED_SHORT){
			throw new FLException(220002, "生产单状态不可操作");
		}
           
		ProductionPicturePO productionPicturePO = new ProductionPicturePO(new UserPO());

		String name = productionPictureVO.getName();
		String _name = name.split("\\.")[0];
		String _suffix = name.split("\\.")[1];

		BeanUtil.copyProperties(productionPictureVO, productionPicturePO, Arrays.asList("creater"));
		
		productionPicturePO.setCreater(userDao.queryUserByUserId(userId));
		productionPicturePO.setName(String.format("%s.%s", _name.substring(0, _name.length() > 8 ? 8 : _name.length()), _suffix));
		productionPicturePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		productionPicturePO.setStatus(productionPictureVO.getStatus());
		productionPicturePO.setType(productionPictureVO.getType());

		productionPictureDao.save(productionPicturePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteProductionPicture(ProductionPictureVO productionPictureVO) throws FLException {
		
		ProductionPicturePO productionPicturePO = productionPictureDao.get(productionPictureVO.getPpid());
		
		if (productionPicturePO == null) {
			throw new FLException(220003, "图纸不存在");
		}
		
		ProductionPO production = productionDao.get(productionPicturePO.getPid());
		
		if(production.getStatus() != ProductionPO.STATUS_SIGNED_SHORT){
			throw new FLException(220002, "生产单状态不可操作");
		}
		
		productionPictureDao.delete(productionPicturePO);

		return 0;
	}

}
