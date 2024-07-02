package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.dao.BrandInstorerDao;
import com.fanglin.communion.po.BrandInstorerPO;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.service.BrandInstorerService;
import com.fanglin.communion.vo.BrandInstorerVO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;

@Service("brandInstorerService")
@Transactional(readOnly = true)
public class BrandInstorerServiceImpl implements BrandInstorerService {

	@Autowired
	private BrandInstorerDao brandInstorerDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BrandDao brandDao;

	@Override
	public List<BrandInstorerVO> queryBrandInstorer(BrandInstorerVO brandInstorerVO) {

		List<BrandInstorerPO> brandInstorerPOs = brandInstorerDao.queryBrandInstorer(brandInstorerVO.getBrand().getBid());
		List<BrandInstorerVO> brandInstorerVOs = new ArrayList<BrandInstorerVO>();

		for (BrandInstorerPO brandInstorerPO : brandInstorerPOs) {

			brandInstorerVO = new BrandInstorerVO(new UserVO(), new BrandVO());

			BeanUtil.copyProperties(brandInstorerPO, brandInstorerVO, Arrays.asList("supplier", "brand"));
			BeanUtil.copyProperties(brandInstorerPO.getInstorer(), brandInstorerVO.getInstorer(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(brandInstorerPO.getBrand(), brandInstorerVO.getBrand(), Arrays.asList("category", "supplier"));

			brandInstorerVOs.add(brandInstorerVO);
		}

		return brandInstorerVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addBrandInstorer(BrandInstorerVO brandInstorerVO) {

		BrandInstorerPO brandInstorerPO = new BrandInstorerPO();

		UserPO instorer = userDao.queryUserByUserId(brandInstorerVO.getInstorer().getUserId());
		BrandPO brand = brandDao.get(brandInstorerVO.getBrand().getBid());

		brandInstorerPO.setInstorer(instorer);
		brandInstorerPO.setBrand(brand);

		brandInstorerDao.save(brandInstorerPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteBrandInstorer(BrandInstorerVO brandInstorerVO) {

		BrandInstorerPO brandInstorerPO = brandInstorerDao.get(brandInstorerVO.getBiid());

		brandInstorerDao.delete(brandInstorerPO);
	}

}
