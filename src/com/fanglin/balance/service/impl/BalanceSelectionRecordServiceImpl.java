package com.fanglin.balance.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.balance.dao.BalanceSelectionRecordDao;
import com.fanglin.balance.po.BalanceSelectionRecordPO;
import com.fanglin.balance.service.BalanceSelectionRecordService;
import com.fanglin.balance.vo.BalanceSelectionRecordVO;
import com.fanglin.personel.vo.UserVO;

@Service("balanceSelectionRecordService")
@Transactional(readOnly = true)
public class BalanceSelectionRecordServiceImpl implements BalanceSelectionRecordService {

	@Autowired
	private BalanceSelectionRecordDao balanceSelectionRecordDao;

	@Override
	public List<BalanceSelectionRecordVO> queryBalanceAccount(BalanceSelectionRecordVO balanceSelectionRecordVO) {

		List<BalanceSelectionRecordPO> balanceSelectionRecordPOs = balanceSelectionRecordDao.queryBalanceSelectionRecord(balanceSelectionRecordVO.getBalanceSelection().getBsid());
		List<BalanceSelectionRecordVO> balanceSelectionRecordVOs = new ArrayList<BalanceSelectionRecordVO>();

		for (BalanceSelectionRecordPO balanceSelectionRecordPO : balanceSelectionRecordPOs) {
			balanceSelectionRecordVOs.add(balanceSelectionRecordPO.ptv(new BalanceSelectionRecordVO(new UserVO())));
		}

		return balanceSelectionRecordVOs;
	}

}
