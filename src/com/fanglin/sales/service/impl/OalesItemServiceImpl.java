package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.OalesDao;
import com.fanglin.sales.dao.OalesItemDao;
import com.fanglin.sales.po.OalesItemPO;
import com.fanglin.sales.po.OalesPO;
import com.fanglin.sales.service.OalesItemService;
import com.fanglin.sales.vo.OalesItemVO;
import com.fanglin.sales.vo.OalesVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

/**
 * 其他销售单项目明细 Service 实现
 */
@Service("oalesItemService")
@Transactional(readOnly = true)
public class OalesItemServiceImpl implements OalesItemService {

	@Autowired
	private OalesItemDao oalesItemDao;

	@Autowired
	private OalesDao oalesDao;

	@Override
	public List<OalesItemVO> pageOalesItem(Paging paging, List<Filter> filters, OalesItemVO oalesItemVO) throws FLException {

		List<OalesItemPO> oalesItemPOs = oalesItemDao.pageOalesItem(paging, filters, oalesItemVO.getOid());
		List<OalesItemVO> oalesItemVOs = new ArrayList<OalesItemVO>();

		for (OalesItemPO oalesItemPO : oalesItemPOs) {
			oalesItemVOs.add(oalesItemPO.ptv(new OalesItemVO()));
		}

		return oalesItemVOs;
	}

	@Override
	public List<OalesItemVO> queryOalesItem(OalesItemVO oalesItemVO) {

		List<OalesItemPO> oalesItemPOs = oalesItemDao.queryOalesItem(oalesItemVO.getOid());
		List<OalesItemVO> oalesItemVOs = new ArrayList<OalesItemVO>();

		for (OalesItemPO oalesItemPO : oalesItemPOs) {
			oalesItemVOs.add(oalesItemPO.ptv(new OalesItemVO()));
		}

		return oalesItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addOalesItem(OalesVO oalesVO, OalesItemVO oalesItemVO) throws FLException {

		// 验证外销单是否存在
		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPO == null) {
			throw new FLException(400001, "外销单不存在");
		}

		// 验证外销单状态（只有初始状态可以添加项目）
		if (oalesPO.getStatus() != OalesPO.STATUS_INIT_INT) {
			throw new FLException(400002, "外销单状态不可操作");
		}

		// 验证商品名称
		if (oalesItemVO.getName() == null || oalesItemVO.getName().trim().isEmpty()) {
			throw new FLException(400003, "商品名称不能为空");
		}

		// 验证价格
		if (oalesItemVO.getPrice() == null || oalesItemVO.getPrice() < 0) {
			throw new FLException(400022, "价格不能为空且不能小于0");
		}

		// 验证数量
		if (oalesItemVO.getNum() == null || oalesItemVO.getNum() <= 0) {
			throw new FLException(400005, "数量必须大于0");
		}

		// 创建项目明细PO
		OalesItemPO oalesItemPO = new OalesItemPO();

		BeanUtil.copyProperties(oalesItemVO, oalesItemPO);

		oalesItemPO.setOid(oalesVO.getOid());

		// 计算小计
		long total = Arith.mul(oalesItemVO.getPrice(), oalesItemVO.getNum());
		oalesItemPO.setTotal(total);

		// 保存项目明细
		oalesItemDao.save(oalesItemPO);
		oalesItemDao.flush();

		// 更新外销单总金额
		oalesPO.setTotal(oalesItemDao.amountOalesItem(oalesPO.getOid()));
		oalesDao.update(oalesPO);

		// 返回新创建的项目ID
		oalesItemVO.setOiid(oalesItemPO.getOiid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteOalesItem(OalesItemVO oalesItemVO) throws FLException {

		// 验证项目明细是否存在
		OalesItemPO oalesItemPO = oalesItemDao.get(oalesItemVO.getOiid());

		if (oalesItemPO == null) {
			throw new FLException(400006, "项目明细不存在");
		}

		// 验证外销单是否存在
		OalesPO oalesPO = oalesDao.get(oalesItemPO.getOid());

		if (oalesPO == null) {
			throw new FLException(400001, "外销单不存在");
		}

		// 验证外销单状态（只有初始状态可以删除项目）
		if (oalesPO.getStatus() != OalesPO.STATUS_INIT_INT) {
			throw new FLException(400002, "外销单状态不可操作");
		}

		// 删除项目明细
		oalesItemDao.delete(oalesItemPO);
		oalesItemDao.flush();

		// 更新外销单总金额
		oalesPO.setTotal(oalesItemDao.amountOalesItem(oalesPO.getOid()));
		oalesDao.update(oalesPO);

		return 0;
	}
}
