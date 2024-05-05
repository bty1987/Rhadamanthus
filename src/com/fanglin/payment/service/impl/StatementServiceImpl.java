package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.StatementDao;
import com.fanglin.payment.po.StatementPO;
import com.fanglin.payment.service.StatementService;
import com.fanglin.payment.vo.StatementVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("statementService")
@Transactional(readOnly = true)
public class StatementServiceImpl implements StatementService {

	@Autowired
	private StatementDao statementDao;

	@Override
	public void pageStatement(Paging paging, List<Filter> filters) {

		List<StatementPO> statementPOs = statementDao.pageStatement(paging, filters);
		List<StatementVO> statementVOs = new ArrayList<StatementVO>();

		for (StatementPO statementPO : statementPOs) {

			StatementVO statementVO = new StatementVO();

			BeanUtil.copyProperties(statementPO, statementVO);

			statementVOs.add(statementVO);
		}

		paging.setData(statementVOs);
	}
}
