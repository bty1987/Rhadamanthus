package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.DecorationDao;
import com.fanglin.customer.po.DecorationPO;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.customer.vo.DecorationVO;
import com.fanglin.decoration.dao.DecorationUserDao;
import com.fanglin.decoration.po.DecorationUserPO;
import com.fanglin.decoration.vo.DecorationUserVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("decorationOrderService")
@Transactional(readOnly=true)
public class DecorationServiceImpl extends DaoImpl<DecorationPO> implements DecorationService{
	
	@Autowired
	private DecorationDao decorationOrderDao;
	
	@Autowired
	private com.fanglin.decoration.dao.DecorationDao decorationDao;
	
	@Autowired
	private DecorationUserDao decorationUserDao;
	
	@Autowired
	private CustomerPhoneDao customerPhoneDao;
	
	@Autowired
	private CustomerDao customerDao;
	
	@Override
	public void queryCusDecorationUser(Paging paging, List<Filter> filters,DecorationVO decorationVO, String unionId) {
		
		DecorationPO decorationPO = decorationOrderDao.queryCusDecorationByOrderId(decorationVO.getOrderId(), unionId);
		
		if(decorationPO != null){
			
			List<DecorationUserPO> decorationUserPOs = decorationUserDao.queryDecorationUser(paging, filters, decorationVO.getOrderId());
			
			List<DecorationUserVO> decorationUserVOs = new ArrayList<DecorationUserVO>();
			
			for(DecorationUserPO decorationUserPO : decorationUserPOs){
				
				DecorationUserVO decorationUserVO = new DecorationUserVO(new UserBaseVO(new DutyVO()));
				
				BeanUtil.copyPropertie(decorationUserPO, decorationUserVO, Arrays.asList("user"));
				BeanUtil.copyPropertie(decorationUserPO.getUser(), decorationUserVO.getUser(), Arrays.asList("dept","duty"));
				BeanUtil.copyPropertie(decorationUserPO.getUser().getDuty(), decorationUserVO.getUser().getDuty(), Arrays.asList("departmentType"));
				
				decorationUserVOs.add(decorationUserVO);
				
			}
			
			paging.setData(decorationUserVOs);
		}
		
	}

	@Override
	public Object queryCusDecoration(DecorationVO decorationVO,String unionId) {
		
		if(decorationVO == null){
			
			List<DecorationPO> decorationPOs = decorationOrderDao.queryCusDecoration(unionId);
			List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
			
			for(DecorationPO decorationPO : decorationPOs){
				
				decorationVO = new DecorationVO(new UserBaseVO(),new UserBaseVO(),new UserBaseVO());
				
				decorationPO.ptv(decorationVO, decorationDao);
				
				decorationVOs.add(decorationVO);
				
			}
			
			return decorationVOs;
			
		}else{
			
			DecorationPO decorationPO = decorationOrderDao.queryCusDecorationByOrderId(decorationVO.getOrderId(), unionId);
			
			decorationVO = new DecorationVO(new UserBaseVO(),new UserBaseVO(),new UserBaseVO());
			
			if(decorationPO != null){
				decorationPO.ptv(decorationVO, decorationDao);
			}
			
			return decorationVO;
		}
		
	}

	@Override
	public DecorationVO queryCusDecorationByOrderId(DecorationVO decorationVO) {
		
		com.fanglin.decoration.po.DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());
		
		decorationVO = new DecorationVO(new UserBaseVO(),new UserBaseVO(),new UserBaseVO());
		
		if(decorationPO != null){
			
			BeanUtil.copyPropertie(decorationPO.getDesigner(), decorationVO.getDesigner(),Arrays.asList("dept","duty"));
			BeanUtil.copyPropertie(decorationPO.getSalesman(), decorationVO.getSalesman(),Arrays.asList("dept","duty"));
			BeanUtil.copyPropertie(decorationPO.getSupervisor(), decorationVO.getSupervisor(),Arrays.asList("dept","duty"));
			
			decorationVO.setCustomerId(decorationPO.getCustomer().getCid());
			decorationVO.setContractTime(decorationPO.getContractTime());
			decorationVO.setAddress(decorationPO.getHouse().getVillage().getName()+" "+decorationPO.getHouse().getHouseNumber());
			decorationVO.setCreateTime(decorationPO.getCreateTime());
			decorationVO.setDepositTime(decorationPO.getDepositTime());
			decorationVO.setHouseArea(decorationPO.getHouse().getBuildArea());
			decorationVO.setMeasureTime(decorationPO.getMeasureTime());
			decorationVO.setOrderId(decorationPO.getOrderId());
			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			
		}
		
		return decorationVO;
	}

	@Override
	public DecorationVO queryCusDecorationForDefault(String unionId) throws FLException{
		
		DecorationPO decorationPO = decorationOrderDao.queryCusDecorationForDefault(unionId);
		
		DecorationVO decorationVO = new DecorationVO(new UserBaseVO(),new UserBaseVO(),new UserBaseVO());
		
		if(decorationPO!=null){
			
			decorationPO.ptv(decorationVO, decorationDao);
			
		}
		
		return decorationVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int bindingCusDecoration(DecorationVO decorationVO,String unionId, String securityCode, String verifyCode) throws FLException {
		
		try {
		    if(!verifyCode.equals(AESHelper.decryptString(securityCode, SystemConfig.getString("encryptKey")))){
		        throw new FLException(910113, "绑定订单失败,验证码错误");
			}
		} catch (Exception e) {
			throw new FLException(910113, "绑定订单失败,验证码错误");
		}
		
		decorationOrderDao.deleteCusDecorationByUnionId(unionId);
		
		List<CustomerPhonePO> customerPhonePOs = customerPhoneDao.queryCustomerPhoneByPhone(decorationVO.getCustomerPhone(), CustomerPhonePO.STATUS_ENABLE_INT, null);

		if(customerPhonePOs != null && customerPhonePOs.size() > 0){

		    CustomerPO customerPO = customerDao.get(customerPhonePOs.get(0).getCid());
		    
		    if(customerPO != null){
		    
		        List<com.fanglin.decoration.po.DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomerId(customerPO.getCid());
		        
		        if(decorationPOs.size()==0 || decorationPOs == null){
		        	throw new FLException(330009, "无可绑定订单");
		        }
		        
		        for(com.fanglin.decoration.po.DecorationPO decorationPO : decorationPOs){
					
					DecorationPO _decorationPO = new DecorationPO();
					
					_decorationPO.setOrderId(decorationPO.getOrderId());
					_decorationPO.setAddress(decorationPO.getHouse().getVillage().getName()+" "+ decorationPO.getHouse().getHouseNumber());
					_decorationPO.setUnionId(unionId);
					_decorationPO.setDefaultFlag(DecorationPO.DEFAULTFLAG_INIT_SHORT);
					
					decorationOrderDao.save(_decorationPO);
					
				}
		        
		    }
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateCusDecorationForDefault(DecorationVO decorationVO,String unionId) throws FLException {
		
		DecorationPO decorationPO = decorationOrderDao.queryCusDecorationByOrderId(decorationVO.getOrderId(),unionId);
		
		if(decorationPO != null){
			
			DecorationPO _decorationPO = decorationOrderDao.queryCusDecorationForDefault(unionId);
			
			if(_decorationPO != null){
				
				_decorationPO.setDefaultFlag(DecorationPO.DEFAULTFLAG_INIT_SHORT);
				decorationPO.setDefaultFlag(DecorationPO.DEFAULTFLAG_DEFAULT_SHORT);
				
				decorationOrderDao.update(_decorationPO);
				decorationOrderDao.update(decorationPO);
				
			}else{
				
				decorationPO.setDefaultFlag(DecorationPO.DEFAULTFLAG_DEFAULT_SHORT);
				
				decorationOrderDao.update(decorationPO);
				
			}
			
		}
		
		return 0;
	}

}
