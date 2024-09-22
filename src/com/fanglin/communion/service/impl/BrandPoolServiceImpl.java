package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.BrandPoolDao;
import com.fanglin.communion.po.BrandPoolPO;
import com.fanglin.communion.po.CategoryPO;
import com.fanglin.communion.service.BrandPoolService;
import com.fanglin.communion.vo.BrandPoolVO;
import com.fanglin.communion.vo.CategoryVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("brandPoolService")
@Transactional(readOnly = true)
public class BrandPoolServiceImpl implements BrandPoolService {

	@Autowired
	private BrandPoolDao brandPoolDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public void pageBrandPool(Paging paging, List<Filter> filters) {

		List<BrandPoolPO> brandPoolPOs = brandPoolDao.pageBrandPool(paging, filters);
		List<BrandPoolVO> brandPoolVOs = new ArrayList<BrandPoolVO>();

		for (BrandPoolPO brandPoolPO : brandPoolPOs) {

			BrandPoolVO brandPoolVO = new BrandPoolVO(new CategoryVO());

			BeanUtil.copyProperties(brandPoolPO, brandPoolVO, Arrays.asList("category"));
			BeanUtil.copyPropertie(brandPoolPO.getCategory(), brandPoolVO.getCategory());

			brandPoolVOs.add(brandPoolVO);
		}

		paging.setData(brandPoolVOs);
	}

	@Override
	public List<BrandPoolVO> queryBrandPoolByName(BrandPoolVO brandPoolVO) {

		List<BrandPoolPO> brandPoolPOs = brandPoolDao.queryBrandPoolByName(brandPoolVO.getName());
		List<BrandPoolVO> brandPoolVOs = new ArrayList<BrandPoolVO>();

		for (BrandPoolPO brandPoolPO : brandPoolPOs) {

			brandPoolVO = new BrandPoolVO(new CategoryVO());

			BeanUtil.copyProperties(brandPoolPO, brandPoolVO, Arrays.asList("category"));
			BeanUtil.copyPropertie(brandPoolPO.getCategory(), brandPoolVO.getCategory());

			brandPoolVOs.add(brandPoolVO);
		}

		return brandPoolVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addBrandPool(BrandPoolVO brandPoolVO, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		BrandPoolPO brandPoolPO = new BrandPoolPO();

		BeanUtil.copyProperties(brandPoolVO, brandPoolPO, Arrays.asList("category"));

		int count = countingService.queryCountingByTypeDate(1, CountingPO.COUNTING_DATE_SILNLE_STR, company);
		String no = String.format("%sBP_%s", companyPO.getShortname(), FormatUtil.fillZero(count, "000"));

		brandPoolPO.setNo(no);
		brandPoolPO.setCategory(new CategoryPO(brandPoolVO.getCategory().getCid()));
		brandPoolPO.setPinyin(PinYin4Util.getPinyin(brandPoolVO.getName()).get(0).toString());
		brandPoolPO.setStatus(BrandPoolPO.STATUS_ENABLE_INT);

		brandPoolDao.save(brandPoolPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateBrandPool(BrandPoolVO brandPoolVO) throws FLException {

		BrandPoolPO brandPoolPO = brandPoolDao.get(brandPoolVO.getBpid());

		BeanUtil.copyProperties(brandPoolVO, brandPoolPO, Arrays.asList("category"));

		brandPoolPO.setCategory(new CategoryPO(brandPoolVO.getCategory().getCid()));
		brandPoolPO.setPinyin(PinYin4Util.getPinyin(brandPoolVO.getName()).get(0).toString());

		brandPoolDao.update(brandPoolPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateBrandPoolForStatus(BrandPoolVO brandPoolVO) throws FLException {

		BrandPoolPO brandPoolPO = brandPoolDao.get(brandPoolVO.getBpid());

		brandPoolPO.setStatus(brandPoolVO.getStatus());

		brandPoolDao.update(brandPoolPO);

		return 0;
	}

}
