package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.ColorVO;
import com.fanglin.data.material.vo.FormatVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.sales.dao.SalesRefundsDao;
import com.fanglin.sales.dao.SalesRefundsItemDao;
import com.fanglin.sales.po.SalesRefundsItemPO;
import com.fanglin.sales.po.SalesRefundsPO;
import com.fanglin.sales.service.SalesRefundsItemService;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.sales.vo.SalesRefundsItemVO;
import com.fanglin.sales.vo.SalesRefundsVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("RefundsItemService")
@Transactional(readOnly = true)
public class SalesRefundsItemServiceImpl implements SalesRefundsItemService {

	@Autowired
	private SalesRefundsDao refundsDao;

	@Autowired
	private SalesRefundsItemDao refundsItemDao;

	@Override
	public void pageSalesRefunds(Paging paging, List<Filter> filters) throws FLException {

		List<SalesRefundsVO> refundsVOs = new ArrayList<SalesRefundsVO>();
		List<SalesRefundsPO> refundsPOs = refundsDao.pageSalesRefunds(paging, filters);

		for (SalesRefundsPO refundsPO : refundsPOs) {

			SalesRefundsVO refundsVO = new SalesRefundsVO(new UserVO(), new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()));

			BeanUtil.copyProperties(refundsPO, refundsVO, Arrays.asList("creater", "sales"));
			BeanUtil.copyProperties(refundsPO.getCreater(), refundsVO.getCreater(), Arrays.asList("role", "dept", "duty"));

			refundsPO.getSales().ptv(refundsVO.getSales());

			refundsVOs.add(refundsVO);
		}

		paging.setData(refundsVOs);
	}

	@Override
	public List<SalesRefundsVO> querySalesRefundsBySid(SalesRefundsVO refundsVO) {

		List<SalesRefundsVO> refundsVOs = new ArrayList<SalesRefundsVO>();
		List<SalesRefundsPO> refundsPOs = refundsDao.querySalesRefundsBySid(refundsVO.getSales().getSid());

		for (SalesRefundsPO refundsPO : refundsPOs) {

			SalesRefundsVO refunds = new SalesRefundsVO(new UserVO(), new SalesVO());

			BeanUtil.copyProperties(refundsPO, refunds, Arrays.asList("creater", "sales"));
			BeanUtil.copyProperties(refundsPO.getCreater(), refunds.getCreater(), Arrays.asList("role", "dept", "duty"));

			refundsPO.getSales().ptv(refundsVO.getSales());

			refundsVOs.add(refunds);
		}

		return refundsVOs;
	}

	@Override
	public List<SalesRefundsItemVO> querySalesRefundsItemBySid(SalesRefundsVO refundsVO) {

		List<SalesRefundsItemPO> RefundsItemPOs = refundsItemDao.querySalesRefundsItemBySid(refundsVO.getSales().getSid());
		List<SalesRefundsItemVO> RefundsItemVOs = new ArrayList<SalesRefundsItemVO>();

		for (SalesRefundsItemPO refundsItemPO : RefundsItemPOs) {

			SalesRefundsItemVO refundItemVO = new SalesRefundsItemVO(new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO()));

			BeanUtil.copyProperties(refundsItemPO, refundItemVO, Arrays.asList("salesItem"));
			BeanUtil.copyProperties(refundsItemPO.getSalesItem(), refundItemVO.getSalesItem(), Arrays.asList("goods", "color", "format"));
			BeanUtil.copyProperties(refundsItemPO.getSalesItem().getGoods(), refundItemVO.getSalesItem().getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(refundsItemPO.getSalesItem().getColor(), refundItemVO.getSalesItem().getColor());
			BeanUtil.copyProperties(refundsItemPO.getSalesItem().getFormat(), refundItemVO.getSalesItem().getFormat());

			RefundsItemVOs.add(refundItemVO);
		}

		return RefundsItemVOs;
	}

	@Override
	public List<SalesRefundsItemVO> querySalesRefundsItemByRid(SalesRefundsVO refundsVO) {

		List<SalesRefundsItemPO> RefundsItemPOs = refundsItemDao.querySalesRefundsItemByRid(refundsVO.getRid());
		List<SalesRefundsItemVO> RefundsItemVOs = new ArrayList<SalesRefundsItemVO>();

		for (SalesRefundsItemPO refundsItemPO : RefundsItemPOs) {

			SalesRefundsItemVO refundItemVO = new SalesRefundsItemVO(new SalesItemVO(new GoodsVO(), new ColorVO(), new FormatVO()));

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
