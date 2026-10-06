package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.CormtimePO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.quotation.dao.CormtimeDao;
import com.fanglin.data.quotation.service.CormtimeService;
import com.fanglin.data.quotation.vo.CormtimeVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("cormtimeService")
@Transactional(readOnly = true)
public class CormtimeServiceImpl implements CormtimeService {

	@Autowired
	public CormtimeDao cormtimeDao;

	@Override
	public void pageCormtime(Paging paging, List<Filter> filters) {

		List<CormtimePO> cormtimePOs = cormtimeDao.pageCormtime(paging, filters);
		List<CormtimeVO> cormtimeVOs = new ArrayList<CormtimeVO>();

		for (CormtimePO cormtimePO : cormtimePOs) {

			CormtimeVO cormtimeVO = new CormtimeVO(new ConstructionNodeVO());

			BeanUtil.copyProperties(cormtimePO, cormtimeVO, Arrays.asList("constructionNode"));
			BeanUtil.copyProperties(cormtimePO.getConstructionNode(), cormtimeVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			cormtimeVOs.add(cormtimeVO);
		}

		paging.setData(cormtimeVOs);

	}

	@Override
	public List<CormtimeVO> queryCormtimeByQfid(Long qfid) {

		List<CormtimePO> cormtimePOs = cormtimeDao.queryCormtimeByQfid(qfid);
		List<CormtimeVO> cormtimeVOs = new ArrayList<CormtimeVO>();

		for (CormtimePO cormtimePO : cormtimePOs) {

			CormtimeVO cormtimeVO = new CormtimeVO(new ConstructionNodeVO());

			BeanUtil.copyProperties(cormtimePO, cormtimeVO, Arrays.asList("constructionNode"));
			BeanUtil.copyProperties(cormtimePO.getConstructionNode(), cormtimeVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			cormtimeVOs.add(cormtimeVO);
		}

		return cormtimeVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCormtime(CormtimeVO cormtimeVO) {

		CormtimePO cormtimePO = new CormtimePO(new ConstructionNodePO());

		BeanUtil.copyPropertie(cormtimeVO, cormtimePO, Arrays.asList("constructionNode"));
		BeanUtil.copyProperties(cormtimeVO.getConstructionNode(), cormtimePO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

		cormtimePO.setStatus(CormtimePO.STATUS_VALID_STR);

		cormtimeDao.save(cormtimePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteCormtime(CormtimeVO cormtimeVO) {

		cormtimeDao.deleteById(cormtimeVO.getCtid());

		return 0;
	}

}
