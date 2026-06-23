package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationAccountDao;
import com.fanglin.decoration.dao.DecorationAccountItemDao;
import com.fanglin.decoration.po.DecorationAccountItemPO;
import com.fanglin.decoration.po.DecorationAccountPO;
import com.fanglin.decoration.service.DecorationAccountItemService;
import com.fanglin.decoration.vo.DecorationAccountItemVO;
import com.fanglin.utils.BeanUtil;

@Service("decorationAccountItemService")
@Transactional(readOnly = true)
public class DecorationAccountItemServiceImpl implements DecorationAccountItemService {

	@Autowired
	private DecorationAccountItemDao decorationAccountItemDao;

	@Autowired
	private DecorationAccountDao decorationAccountDao;

	@Override
	public List<DecorationAccountItemVO> queryDecorationAccountItem(DecorationAccountItemVO decorationAccountItemVO) {

		List<DecorationAccountItemPO> decorationAccountItemPOs = null;
		List<DecorationAccountItemVO> decorationAccountItemVOs = new ArrayList<DecorationAccountItemVO>();

		if (decorationAccountItemVO.getDaid() != null) {
			decorationAccountItemPOs = decorationAccountItemDao.queryDecorationAccountItem(decorationAccountItemVO.getDaid());
		} else {
			decorationAccountItemPOs = decorationAccountItemDao.queryDecorationAccountItem(decorationAccountItemVO.getOrderId());
		}

		for (DecorationAccountItemPO decorationAccountItemPO : decorationAccountItemPOs) {

			DecorationAccountItemVO _decorationAccountItemVO = new DecorationAccountItemVO();

			BeanUtil.copyPropertie(decorationAccountItemPO, _decorationAccountItemVO);

			decorationAccountItemVOs.add(_decorationAccountItemVO);
		}

		return decorationAccountItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationAccountItem(DecorationAccountItemVO decorationAccountItemVO, List<DecorationAccountItemVO> decorationAccountItems) throws FLException {

		if (decorationAccountItemVO == null || decorationAccountItemVO.getOrderId() == null) {
			throw new FLException(140081, "决算信息不存在");
		}

		DecorationAccountPO decorationAccountPO = decorationAccountDao.queryDecorationAccount(decorationAccountItemVO.getOrderId());

		if (decorationAccountPO == null) {
			throw new FLException(140081, "决算信息不存在");
		}

		decorationAccountItemDao.deleteDecorationAccountItem(decorationAccountItemVO.getOrderId());

		if (decorationAccountItems == null || decorationAccountItems.size() == 0) return;

		int sort = 0;

		for (DecorationAccountItemVO item : decorationAccountItems) {

			DecorationAccountItemPO decorationAccountItemPO = new DecorationAccountItemPO();

			BeanUtil.copyPropertie(item, decorationAccountItemPO);

			decorationAccountItemPO.setDaid(decorationAccountPO.getDaid());
			decorationAccountItemPO.setOrderId(decorationAccountPO.getOrderId());
			decorationAccountItemPO.setSort(item.getSort() == null ? sort : item.getSort());

			decorationAccountItemDao.save(decorationAccountItemPO);

			sort++;
		}
	}

}
