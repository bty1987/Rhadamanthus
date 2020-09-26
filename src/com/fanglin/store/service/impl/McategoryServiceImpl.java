package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.McategoryDao;
import com.fanglin.store.po.McategoryPO;
import com.fanglin.store.service.McategoryService;
import com.fanglin.store.vo.McategoryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("mcategoryService")
@Transactional(readOnly = true)
public class McategoryServiceImpl implements McategoryService {

	@Autowired
	private McategoryDao mcategoryDao;

	@Override
	public void pageMcategory(Paging paging, List<Filter> filters) {

		List<McategoryPO> mcategoryPOs = mcategoryDao.pageMcategory(paging, filters);
		List<McategoryVO> mcategoryVOs = new ArrayList<McategoryVO>();

		for (McategoryPO mcategoryPO : mcategoryPOs) {

			McategoryVO mcategoryVO = new McategoryVO();

			BeanUtil.copyProperties(mcategoryPO, mcategoryVO);

			mcategoryVOs.add(mcategoryVO);
		}

		paging.setData(mcategoryVOs);
	}

	@Override
	public List<McategoryVO> queryMcategory() {

		List<McategoryPO> mcategoryPOs = mcategoryDao.queryMcategory();
		List<McategoryVO> mcategoryVOs = new ArrayList<McategoryVO>();

		for (McategoryPO mcategoryPO : mcategoryPOs) {

			McategoryVO mcategoryVO = new McategoryVO();

			BeanUtil.copyProperties(mcategoryPO, mcategoryVO);

			mcategoryVOs.add(mcategoryVO);
		}

		return mcategoryVOs;
	}

	@Override
	public List<McategoryVO> queryMcategoryForShow() {

		List<McategoryPO> mcategoryPOs = mcategoryDao.queryMcategoryForShow();

		List<McategoryVO> mcategoryVOs = new ArrayList<McategoryVO>();

		for (McategoryPO mcategoryPO : mcategoryPOs) {

			McategoryVO mcategoryVO = new McategoryVO();

			BeanUtil.copyProperties(mcategoryPO, mcategoryVO);

			mcategoryVOs.add(mcategoryVO);
		}

		return mcategoryVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addMcategory(McategoryVO mcategoryVO) throws FLException {

		McategoryPO mcategoryPO = new McategoryPO();

		BeanUtil.copyProperties(mcategoryVO, mcategoryPO, Arrays.asList("isShow"));

		mcategoryDao.save(mcategoryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateMcategory(McategoryVO mcategory) throws FLException {

		McategoryPO mcategoryPO = mcategoryDao.get(mcategory.getCid());

		if (mcategoryPO == null) {
			throw new FLException(340003, "品类不存在");
		}

		BeanUtil.copyProperties(mcategory, mcategoryPO, Arrays.asList("isShow"));

		mcategoryDao.update(mcategoryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateMcategoryForShow(McategoryVO mcategory) throws FLException {

		McategoryPO mcategoryPO = mcategoryDao.get(mcategory.getCid());

		if (mcategoryPO == null) {
			throw new FLException(340003, "品类不存在");
		}

		mcategoryPO.setIsShow(mcategory.getIsShow());

		mcategoryDao.update(mcategoryPO);

		return 0;
	}

}
