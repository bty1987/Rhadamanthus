package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.NormpackPO;
import com.fanglin.data.quotation.dao.NormpackDao;
import com.fanglin.data.quotation.service.NormpackService;
import com.fanglin.data.quotation.vo.NormpackVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("normpackService")
@Transactional(readOnly = true)
public class NormpackServiceImpl implements NormpackService {

	@Autowired
	private NormpackDao normpackDao;

	@Override
	public void pageNormpack(Paging paging, List<Filter> filters, int company) {

		List<NormpackPO> normpackPOs = normpackDao.pageNormpack(paging, filters, company);
		List<NormpackVO> normpackVOs = new ArrayList<NormpackVO>();

		NormpackVO normpack;

		for (NormpackPO normpackPO : normpackPOs) {

			normpack = new NormpackVO();

			BeanUtil.copyProperties(normpackPO, normpack);

			normpackVOs.add(normpack);
		}

		paging.setData(normpackVOs);

	}

	@Override
	public List<NormpackVO> queryNormpack(NormpackVO normpackVO, int company) {

		List<NormpackPO> normpackPOs = normpackDao.queryNormpack(company);
		List<NormpackVO> normpackVOs = new ArrayList<NormpackVO>();

		for (NormpackPO normpackPO : normpackPOs) {

			NormpackVO normpack = new NormpackVO();

			BeanUtil.copyProperties(normpackPO, normpack);

			normpackVOs.add(normpack);
		}

		return normpackVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addNormpack(NormpackVO normpackVO, int company) {

		NormpackPO normpackPO = new NormpackPO();

		BeanUtil.copyProperties(normpackVO, normpackPO);

		normpackPO.setCompany(company);

		normpackDao.save(normpackPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateNormpackForStatus(NormpackVO normpackVO) {

		NormpackPO normpackPO = normpackDao.get(normpackVO.getNpid());

		if (normpackPO != null) {

			normpackPO.setStatus(normpackVO.getStatus());

			normpackDao.update(normpackPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteNormpack(NormpackVO normpackVO) {

		NormpackPO normpackPO = normpackDao.get(normpackVO.getNpid());

		if (normpackPO != null) {

			normpackDao.delete(normpackPO);
		}

		return 0;
	}

}
