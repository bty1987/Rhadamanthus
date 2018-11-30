package com.fanglin.customer.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.VustomerDao;
import com.fanglin.customer.po.VustomerPO;
import com.fanglin.customer.service.VustomerService;
import com.fanglin.customer.vo.VustomerVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("vustomerService")
@Transactional(readOnly = true)
public class VustomerServiceImpl implements VustomerService {

	@Autowired
	private VustomerDao vustomerDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private com.fanglin.dingding.service.MessageService messageDDService;

	@Override
	public void pageVustomer(Paging paging, List<Filter> filters, String userId) {
		
		filters.add(new Filter("belonger", userId, "eq"));
		
		List<VustomerPO> vustomerPOs = vustomerDao.pageVustomer(paging, filters);

		List<VustomerVO> vustomerVOs = new ArrayList<VustomerVO>();
		
		if(vustomerPOs.size() != 0 && vustomerPOs != null){
			
			for (VustomerPO vustomerPO : vustomerPOs){
				
				vustomerVOs.add(vustomerVOToPO(vustomerPO));
			}
			
		}
		
		paging.setData(vustomerVOs);

	}
	
	@Override
	public void pageVustomerForAdvance(Paging paging, List<Filter> filters) {
		
		List<VustomerPO> vustomerPOs = vustomerDao.pageVustomer(paging, filters);

		List<VustomerVO> vustomerVOs = new ArrayList<VustomerVO>();
		
		if(vustomerPOs.size() != 0 && vustomerPOs != null){
			
			for (VustomerPO vustomerPO : vustomerPOs){
				
				vustomerVOs.add(vustomerVOToPO(vustomerPO));
			}
			
		}
			
		paging.setData(vustomerVOs);
	}
	
	@Override
	public void pageVustomerByUnionId(Paging paging, List<Filter> filters, String unionId) {

		List<VustomerPO> vustomerPOs = vustomerDao.pageVustomerByUnionId(paging, filters, unionId);

		List<VustomerVO> vustomerVOs = new ArrayList<VustomerVO>();
			
		if(vustomerPOs.size() != 0 && vustomerPOs != null){
			
			for (VustomerPO vustomerPO : vustomerPOs){
				
				vustomerVOs.add(vustomerVOToPO(vustomerPO));
			}
			
		}
		
		paging.setData(vustomerVOs);
	}

	@Override
	public List<VustomerVO> queryVustomerByUnionId(VustomerVO vustomerVO) {
		
		List<VustomerPO> vustomerPOs = vustomerDao.queryVustomerByUnionId(vustomerVO.getUnionId());
		
		List<VustomerVO> vustomerVOs = new ArrayList<VustomerVO>();
		
		if(vustomerPOs.size() != 0 && vustomerPOs != null){
			
			for(VustomerPO vustomerPO : vustomerPOs){
				
				VustomerVO vustomer = new VustomerVO(new UserBaseVO());
				
				BeanUtil.copyProperties(vustomerPO, vustomer, Arrays.asList("belonger"));
				BeanUtil.copyProperties(vustomerPO.getBelonger(), vustomer.getBelonger(), Arrays.asList("duty", "dept"));
				
				vustomerVOs.add(vustomer);
			}
			
		}
		
		return vustomerVOs;
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addVustomer(VustomerVO vustomerVO) {
		
		VustomerPO vustomerPO = new VustomerPO();
		
		BeanUtil.copyProperties(vustomerVO, vustomerPO);
		vustomerPO.setStatus(VustomerPO.STATUS_INIT_INT);
		vustomerPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		
		vustomerDao.save(vustomerPO);
		
		messageDDService.sendMessage("71449a2f7b476bf25fde8e568253c80d093ea7142e3e3731b926bc545c3ef4c3", String.format("姓名: %s,地址: %s.", vustomerPO.getName(), vustomerPO.getAddress()));
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateVustomer(VustomerVO vustomerVO) throws FLException {
		
		VustomerPO vustomerPO = vustomerDao.get(vustomerVO.getVid());
		
		if(vustomerPO == null) throw new FLException(330003, "客户信息不存在");
		
		if(vustomerPO.getOrderId() != null) throw new FLException(330004, "客户已绑装修单");
		
		String orderId = vustomerVO.getOrderId();
		
		List<VustomerPO> vustomers = vustomerDao.queryVustomer();
		List<String> orderIds = new ArrayList<String>();
		
		for (VustomerPO vustomer : vustomers) {
			orderIds.add(vustomer.getOrderId());
		}
		
		if(orderIds.contains(orderId)) throw new FLException(330005, "装修单已被绑定");
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId); 
		
		if(decorationPO == null) throw new FLException(140013, "订单不存在");
		
		if(decorationPO.getOrderTotalPrice() == 0 && decorationPO.getStatus() != DecorationPO.STATUS_SIGNED_INT) throw new FLException(330006, "装修单未签约");
		
		vustomerPO.setOrderId(orderId);
		
		vustomerPO.setContractPrice(decorationPO.getOrderTotalPrice());
		
		vustomerDao.update(vustomerPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteVustomer(VustomerVO vustomerVO) {
		
		VustomerPO vustomerPO = vustomerDao.get(vustomerVO.getVid());
		
		vustomerPO.setStatus(VustomerPO.STATUS_DISABLE_INT);
		
		vustomerDao.update(vustomerPO);
		
	}

	@Override
	public List<?> countVustomerByUnionId(VustomerVO vustomerVO) {
	
		 List<?> count = vustomerDao.countVustomerByUnionId(vustomerVO.getUnionId());
		 
		return count;
	}


	@Override
	public void pageVustomerForCommunion(Paging paging, List<Filter> filters) {

		String empty = null;
		filters.add(new Filter("belonger.uid", empty , "eq"));

		List<VustomerPO> vustomerPOs = vustomerDao.pageVustomer(paging, filters);

		List<VustomerVO> vustomerVOs = new ArrayList<VustomerVO>();
			
		for (VustomerPO vustomerPO : vustomerPOs){
			
			vustomerVOs.add(vustomerVOToPO(vustomerPO));
		}
		
		paging.setData(vustomerVOs);
		
	}


	@Override
	@Transactional(rollbackFor = Exception.class)
	public void freeVustomer(VustomerVO vustomerVO) throws FLException {
		
		VustomerPO vustomerPO = vustomerDao.get(vustomerVO.getVid());
		
		if(vustomerPO == null){
			throw new FLException(330003, "客户信息不存在");
		}
		if(vustomerPO.getOrderId() != null){
			throw new FLException(330004, "客户已绑装修单");
		}
		vustomerPO.setBelonger(null);
		
		vustomerDao.update(vustomerPO);
		
	}


	@Override
	@Transactional(rollbackFor = Exception.class)
	public void takeVustomer(VustomerVO vustomerVO, String userId) throws FLException {
		
		VustomerPO vustomerPO = vustomerDao.get(vustomerVO.getVid());
		
		if(vustomerPO == null){
			throw new FLException(330003, "客户信息不存在");
		}
		if(vustomerPO.getOrderId() != null){
			throw new FLException(330004 , "客户已绑装修单");
		}
		if(vustomerPO.getBelonger() != null){
			throw new FLException(330007, "客户存在归属");
		}
		
		UserPO belonger = userDao.queryUserByUserId(userId);
		
		vustomerPO.setBelonger(belonger);
		
		vustomerDao.update(vustomerPO);
	}


	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateVustomerForBelonger(VustomerVO vustomerVO) throws FLException {
		
		VustomerPO vustomerPO = vustomerDao.get(vustomerVO.getVid());
		
		if(vustomerPO == null){
			throw new FLException(330003, "客户信息不存在");
		}
		if(vustomerPO.getOrderId() != null){
			throw new FLException(330004 , "客户已绑装修单");
		}
		
		UserPO belonger = userDao.get(vustomerVO.getBelonger().getUid());

		vustomerPO.setBelonger(belonger);
		
		vustomerDao.update(vustomerPO);
	}
	
	public VustomerVO vustomerVOToPO(VustomerPO vustomerPO){
		
		VustomerVO vustomerVO = new VustomerVO(new UserBaseVO());
		
		BeanUtil.copyProperties(vustomerPO, vustomerVO, Arrays.asList("belonger"));
		BeanUtil.copyProperties(vustomerPO.getBelonger(), vustomerVO.getBelonger(), Arrays.asList("dept", "duty", "role"));
		
		return vustomerVO;
		
	}

}
