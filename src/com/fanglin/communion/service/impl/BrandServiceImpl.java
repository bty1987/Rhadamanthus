/**
 * @File Name		: BrandServiceImpl.java
 * @Package   	: com.fanglin.data.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.CategoryPO;
import com.fanglin.communion.service.BrandService;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;
import com.fanglin.utils.SystemConfig;

@Service("brandService")
@Transactional(readOnly = true)
public class BrandServiceImpl implements BrandService {

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageBrand(Paging paging, List<Filter> filters, int company) {

		List<BrandPO> brandPOs = brandDao.pageBrand(paging, filters, company);
		List<BrandVO> brandVOs = new ArrayList<BrandVO>();

		for (BrandPO brandPO : brandPOs) {
			BrandVO brandVO = new BrandVO(new UserBaseVO());
			BeanUtil.copyProperties(brandPO, brandVO, Arrays.asList("category", "supplier"));
			BeanUtil.copyProperties(brandPO.getSupplier(), brandVO.getSupplier(), Arrays.asList("role", "dept", "duty"));

			CategoryPO categoryPO = brandPO.getCategory();

			brandVO.setCid(categoryPO.getCid());
			brandVO.setCategoryId(categoryPO.getNo());
			brandVO.setCategoryName(categoryPO.getName());

			brandVOs.add(brandVO);
		}

		paging.setData(brandVOs);
	}

	@Override
	public List<BrandVO> queryBrand(int company) {

		List<BrandPO> brandPOs = brandDao.list();
		List<BrandVO> brandVOs = new ArrayList<BrandVO>();

		for (BrandPO brandPO : brandPOs) {
			BrandVO brandVO = new BrandVO();
			BeanUtil.copyProperties(brandPO, brandVO, Arrays.asList("category", "supplier"));

			CategoryPO categoryPO = brandPO.getCategory();

			brandVO.setCategoryId(categoryPO.getNo());
			brandVO.setCategoryName(categoryPO.getName());
			brandVO.setCompany(company);

			brandVOs.add(brandVO);
		}

		return brandVOs;
	}

	@Override
	public List<BrandVO> queryBrandForPinYinName(String pinyinName, Integer company) {

		Paging paging = new Paging(0, 10);

		List<BrandPO> brandPOs = brandDao.pageBrandByPinYinName(paging, pinyinName, company);
		List<BrandVO> brandVOs = new ArrayList<BrandVO>();

		for (BrandPO brandPO : brandPOs) {
			BrandVO _brandVO = new BrandVO();

			BeanUtil.copyProperties(brandPO, _brandVO, Arrays.asList("category", "supplier"));

			CategoryPO categoryPO = brandPO.getCategory();

			_brandVO.setCategoryId(categoryPO.getNo());
			_brandVO.setCategoryName(categoryPO.getName());

			brandVOs.add(_brandVO);
		}

		return brandVOs;
	}

	@Override
	public BrandVO queryBrandByBid(BrandVO brandVO) {

		BrandPO brandPO = brandDao.queryBrandByBid(brandVO.getBid());

		BeanUtil.copyProperties(brandPO, brandVO, Arrays.asList("category", "supplier"));

		CategoryPO categoryPO = brandPO.getCategory();

		brandVO.setCategoryId(categoryPO.getNo());
		brandVO.setCategoryName(categoryPO.getName());

		return brandVO;
	}

	@Override
	public BrandVO queryBrandByNo(BrandVO brandVO) {

		BrandPO brandPO = brandDao.queryBrandByNo(brandVO.getNo());

		BeanUtil.copyProperties(brandPO, brandVO, Arrays.asList("category", "supplier"));

		CategoryPO categoryPO = brandPO.getCategory();

		brandVO.setCategoryId(categoryPO.getNo());
		brandVO.setCategoryName(categoryPO.getName());

		return brandVO;
	}

	@Override
	public List<BrandVO> queryBrandByCid(BrandVO brandVO) {

		List<BrandPO> brandPOs = brandDao.queryBrandByCid(brandVO.getCid());
		List<BrandVO> brandVOs = new ArrayList<BrandVO>();

		for (BrandPO brandPO : brandPOs) {
			brandVO = new BrandVO();
			BeanUtil.copyProperties(brandPO, brandVO, Arrays.asList("category", "supplier"));

			CategoryPO categoryPO = brandPO.getCategory();

			brandVO.setCategoryId(categoryPO.getNo());
			brandVO.setCategoryName(categoryPO.getName());

			brandVOs.add(brandVO);
		}

		return brandVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addBrand(BrandVO brandVO, int company) {

		BrandPO brandPO = new BrandPO();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_BRAND_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

		UserPO supplier = userDao.queryUserByUserId(brandVO.getSupplier().getUserId());

		StringBuffer brandNo = new StringBuffer();
		brandNo.append(SystemConfig.getString("brandIdent", "B_"));
		brandNo.append(FormatUtil.fillZero(count, "000"));
		brandPO.setNo(brandNo.toString());
		BeanUtil.copyProperties(brandVO, brandPO, Arrays.asList("no", "category", "supplier"));
		brandPO.setCompany(company);
		brandPO.setCategory(new CategoryPO(brandVO.getCid()));
		brandPO.setSupplier(supplier);
		brandPO.setPinyin(PinYin4Util.getPinyin(brandVO.getName()).get(0).toString());
		brandDao.save(brandPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateBrand(BrandVO brandVO) {

		BrandPO brandPO = brandDao.get(brandVO.getBid());

		UserPO supplier = userDao.queryUserByUserId(brandVO.getSupplier().getUserId());

		BeanUtil.copyProperties(brandVO, brandPO, Arrays.asList("category", "supplier", "company"));

		brandPO.setCategory(new CategoryPO(brandVO.getCid()));
		brandPO.setSupplier(supplier);

		if (brandVO.getName() != null && brandVO.getName() != "") {
			brandPO.setPinyin(PinYin4Util.getPinyin(brandVO.getName()).get(0).toString());
		}

		brandDao.update(brandPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteBrandByBIds(List<Long> bIds) {

		for (long bId : bIds) {
			brandDao.deleteById(bId);
		}

		return 0;
	}

}
