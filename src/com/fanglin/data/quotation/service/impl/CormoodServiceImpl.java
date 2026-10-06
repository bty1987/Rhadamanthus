package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.NoodsDao;
import com.fanglin.data.material.vo.NoodsVO;
import com.fanglin.data.po.CormoodPO;
import com.fanglin.data.po.NoodsPO;
import com.fanglin.data.quotation.dao.CormoodDao;
import com.fanglin.data.quotation.service.CormoodService;
import com.fanglin.data.quotation.vo.CormoodVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("cormoodService")
@Transactional(readOnly = true)
public class CormoodServiceImpl implements CormoodService {

	@Autowired
	public CormoodDao cormoodDao;

	@Autowired
	public NoodsDao noodsDao;

	@Override
	public void pageCormood(Paging paging, List<Filter> filters) {

		List<CormoodPO> cormoodPOs = cormoodDao.pageCormood(paging, filters);
		List<CormoodVO> cormoodVOs = new ArrayList<CormoodVO>();

		for (CormoodPO cormoodPO : cormoodPOs) {

			CormoodVO cormoodVO = new CormoodVO(new NoodsVO());

			BeanUtil.copyProperties(cormoodPO, cormoodVO, Arrays.asList("noods"));

			if (cormoodPO.getNoods() != null) BeanUtil.copyPropertie(cormoodPO.getNoods(), cormoodVO.getNoods());

			cormoodVOs.add(cormoodVO);
		}

		paging.setData(cormoodVOs);

	}

	@Override
	public List<CormoodVO> queryCormoodByQfid(Long qfid) {

		List<CormoodPO> cormoodPOs = cormoodDao.queryCormoodByQfid(qfid);
		List<CormoodVO> cormoodVOs = new ArrayList<CormoodVO>();

		for (CormoodPO cormoodPO : cormoodPOs) {

			CormoodVO cormoodVO = new CormoodVO(new NoodsVO());

			BeanUtil.copyProperties(cormoodPO, cormoodVO, Arrays.asList("noods"));

			if (cormoodPO.getNoods() != null) BeanUtil.copyPropertie(cormoodPO.getNoods(), cormoodVO.getNoods());

			cormoodVOs.add(cormoodVO);
		}

		return cormoodVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCormood(CormoodVO cormoodVO) throws FLException {

		CormoodPO cormoodPO = new CormoodPO();

		BeanUtil.copyPropertie(cormoodVO, cormoodPO, Arrays.asList("noods"));

		NoodsPO noodsPO = noodsDao.get(cormoodVO.getNoods().getNid());

		if (noodsPO == null) {
			throw new FLException(130118, "定材不存在");
		}

		cormoodPO.setName(noodsPO.getName());
		cormoodPO.setNoods(noodsPO);

		cormoodPO.setStatus(CormoodPO.STATUS_VALID_STR);

		cormoodDao.save(cormoodPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteCormood(CormoodVO cormoodVO) {

		cormoodDao.deleteById(cormoodVO.getCgid());

		return 0;
	}

}
