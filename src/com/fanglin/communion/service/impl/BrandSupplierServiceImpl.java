package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.dao.BrandSupplierDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.BrandSupplierPO;
import com.fanglin.communion.service.BrandSupplierService;
import com.fanglin.communion.vo.BrandSupplierVO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;

@Service("brandSupplierService")
@Transactional(readOnly = true)
public class BrandSupplierServiceImpl implements BrandSupplierService {

	@Autowired
	private BrandSupplierDao brandSupplierDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private BrandDao brandDao;

	@Override
	public List<BrandSupplierVO> queryBrandSupplier(BrandSupplierVO brandSupplierVO) {

		List<BrandSupplierPO> brandSupplierPOs = brandSupplierDao.queryBrandSupplier(brandSupplierVO.getBrand().getBid());
		List<BrandSupplierVO> brandSupplierVOs = new ArrayList<BrandSupplierVO>();

		for (BrandSupplierPO brandSupplierPO : brandSupplierPOs) {

			brandSupplierVO = new BrandSupplierVO(new UserVO(), new BrandVO());

			BeanUtil.copyProperties(brandSupplierPO, brandSupplierVO, Arrays.asList("supplier", "brand"));
			BeanUtil.copyProperties(brandSupplierPO.getSupplier(), brandSupplierVO.getSupplier(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(brandSupplierPO.getBrand(), brandSupplierVO.getBrand(), Arrays.asList("category", "supplier"));

			brandSupplierVOs.add(brandSupplierVO);
		}

		return brandSupplierVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addBrandSupplier(BrandSupplierVO brandSupplierVO) {

		BrandSupplierPO brandSupplierPO = new BrandSupplierPO();

		UserPO supplier = userDao.queryUserByUserId(brandSupplierVO.getSupplier().getUserId());
		BrandPO brand = brandDao.get(brandSupplierVO.getBrand().getBid());

		brandSupplierPO.setSupplier(supplier);
		brandSupplierPO.setBrand(brand);

		brandSupplierDao.save(brandSupplierPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteBrandSupplier(BrandSupplierVO brandSupplierVO) {
		BrandSupplierPO brandSupplierPO = brandSupplierDao.get(brandSupplierVO.getBuid());

		brandSupplierDao.delete(brandSupplierPO);
	}

}
