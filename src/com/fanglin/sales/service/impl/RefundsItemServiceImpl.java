package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.sales.dao.RefundsDao;
import com.fanglin.sales.dao.RefundsItemDao;
import com.fanglin.sales.po.RefundsItemPO;
import com.fanglin.sales.po.RefundsPO;
import com.fanglin.sales.service.RefundsItemService;
import com.fanglin.sales.vo.RefundsItemVO;
import com.fanglin.sales.vo.RefundsVO;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.utils.BeanUtil;

@Service("RefundsItemService")
@Transactional(readOnly = true)
public class RefundsItemServiceImpl implements RefundsItemService {

	@Autowired
	private RefundsDao refundsDao;

	@Autowired
	private RefundsItemDao refundsItemDao;

	@Override
	public List<RefundsVO> queryRefundsBySid(RefundsVO refundsVO) {

		List<RefundsVO> refundsVOs = new ArrayList<RefundsVO>();
		List<RefundsPO> refundsPOs = refundsDao.queryRefundsBySid(refundsVO.getSid());

		for (RefundsPO refundsPO : refundsPOs) {

			RefundsVO refunds = new RefundsVO(new UserVO());

			BeanUtil.copyProperties(refundsPO, refunds, Arrays.asList("creater"));
			BeanUtil.copyProperties(refundsPO.getCreater(), refunds.getCreater(), Arrays.asList("role", "dept", "duty"));

			refundsVOs.add(refunds);
		}

		return refundsVOs;
	}

	@Override
	public List<RefundsItemVO> queryRefundsItemBySid(RefundsVO refundsVO) {

		List<RefundsItemPO> RefundsItemPOs = refundsItemDao.queryRefundsItemBySid(refundsVO.getSid());
		List<RefundsItemVO> RefundsItemVOs = new ArrayList<RefundsItemVO>();

		for (RefundsItemPO refundsItemPO : RefundsItemPOs) {

			RefundsItemVO refundItemVO = new RefundsItemVO(new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO()));

			BeanUtil.copyProperties(refundsItemPO, refundItemVO, Arrays.asList("salesItem"));
			BeanUtil.copyProperties(refundsItemPO.getSalesItem(), refundItemVO.getSalesItem(), Arrays.asList("goods", "color", "format"));
			BeanUtil.copyProperties(refundsItemPO.getSalesItem().getGoods(), refundItemVO.getSalesItem().getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(refundsItemPO.getSalesItem().getColor(), refundItemVO.getSalesItem().getColor());
			BeanUtil.copyProperties(refundsItemPO.getSalesItem().getFormat(), refundItemVO.getSalesItem().getFormat());

			RefundsItemVOs.add(refundItemVO);
		}

		return RefundsItemVOs;
	}

}
