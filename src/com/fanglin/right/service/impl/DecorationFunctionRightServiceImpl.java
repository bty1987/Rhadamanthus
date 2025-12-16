package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationFunctionDao;
import com.fanglin.decoration.po.DecorationFunctionPO;
import com.fanglin.decoration.vo.DecorationFunctionVO;
import com.fanglin.right.dao.DecorationFunctionRightDao;
import com.fanglin.right.po.DecorationFunctionRightPO;
import com.fanglin.right.service.DecorationFunctionRightService;
import com.fanglin.right.vo.DecorationFunctionRightVO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.BeanUtil;

@Service("decorationFunctionRightService")
@Transactional(readOnly = true)
public class DecorationFunctionRightServiceImpl implements DecorationFunctionRightService {

	@Autowired
	private DecorationFunctionRightDao decorationFunctionRightDao;

	@Autowired
	private DecorationFunctionDao decorationFunctionDao;

	@Override
	public List<DecorationFunctionRightVO> queryDecorationFunctionRightByName(DecorationFunctionRightVO decorationFunctionRightVO, int company) {

		List<DecorationFunctionRightPO> decorationFunctionRightPOs = decorationFunctionRightDao.queryDecorationFunctionRightByName(decorationFunctionRightVO.getName(), company);
		List<DecorationFunctionRightVO> decorationFunctionRightVOs = new ArrayList<DecorationFunctionRightVO>();

		for (DecorationFunctionRightPO decorationFunctionRightPO : decorationFunctionRightPOs) {

			decorationFunctionRightVO = new DecorationFunctionRightVO(new DecorationFunctionVO());

			BeanUtil.copyPropertie(decorationFunctionRightPO, decorationFunctionRightVO, Arrays.asList("decorationFunction"));
			BeanUtil.copyPropertie(decorationFunctionRightPO.getDecorationFunction(), decorationFunctionRightVO.getDecorationFunction());

			decorationFunctionRightVOs.add(decorationFunctionRightVO);
		}

		return decorationFunctionRightVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationFunctionRight(DecorationFunctionRightVO decorationFunctionRightVO, List<Long> dfids, int company) {

		decorationFunctionRightDao.deleteDecorationFunctionRightByName(decorationFunctionRightVO.getName(), company);

		for (Long dfid : dfids) {
			DecorationFunctionRightPO decorationFunctionRightPO = new DecorationFunctionRightPO();
			DecorationFunctionPO decorationFunctionPO = decorationFunctionDao.get(dfid);

			decorationFunctionRightPO.setName(decorationFunctionRightVO.getName());
			decorationFunctionRightPO.setDecorationFunction(decorationFunctionPO);
			decorationFunctionRightPO.setCompany(company);

			decorationFunctionRightDao.save(decorationFunctionRightPO);
		}

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int syncDecorationFunctionRight(DecorationFunctionRightVO decorationFunctionRightVO, List<String> companys, Integer company) throws FLException {

		List<Integer> cids = new ArrayList<Integer>();

		for (String cid : companys) {
			cids.add(CompanyServiceImpl.decode(cid));
		}

		decorationFunctionRightDao.deleteDecorationFunctionRight(decorationFunctionRightVO.getName(), cids);
		decorationFunctionRightDao.syncDecorationFunctionRight(decorationFunctionRightVO.getName(), cids, company);

		return 0;
	}

}
