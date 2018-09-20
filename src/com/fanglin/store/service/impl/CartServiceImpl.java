package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.CartDao;
import com.fanglin.store.dao.MpriceDao;
import com.fanglin.store.dao.MuserDao;
import com.fanglin.store.po.CartPO;
import com.fanglin.store.po.MpricePO;
import com.fanglin.store.po.MuserPO;
import com.fanglin.store.service.CartService;
import com.fanglin.store.vo.CartVO;
import com.fanglin.store.vo.McolorVO;
import com.fanglin.store.vo.MformatVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.store.vo.MpriceVO;
import com.fanglin.store.vo.MuserVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("cartService")
@Transactional(readOnly=true)
public class CartServiceImpl implements CartService{

	@Autowired
	private CartDao cartDao;
	
	@Autowired
	private MpriceDao mpriceDao;
	
	@Autowired
	private MuserDao muserDao;
	
	@Override
	public void pageCart(Paging paging, List<Filter> filters, MuserVO muserVO) {
		
		MuserPO muserPO = muserDao.queryMuserByUnionId(muserVO.getUnionId());
		
        Filter newFilter = new Filter();
      
        newFilter.setField("uid");
      
        newFilter.setData(String.valueOf(muserPO.getUid()));
      
        newFilter.setOp("eq");
      
        filters.add(newFilter);
		
	    List<CartPO> cartPOs = cartDao.pageCart(paging, filters);
	    
	    List<CartVO> cartVOs = new ArrayList<CartVO>();
	    
	    for (CartPO cartPO : cartPOs){

	      cartVOs.add(cartPOToVO(cartPO));
	      
	    }
	    
	    paging.setData(cartVOs);
		
	}
		
	@Override
	public List<CartVO> queryCartByUnionId(MuserVO muserVO) throws FLException {
		
		MuserPO muserPO = muserDao.queryMuserByUnionId(muserVO.getUnionId());
		
		if(muserPO == null){
			throw new FLException(340009, "用户不存在");
		}
		
		List<CartPO> cartPOs = cartDao.queryCartByUid(muserPO.getUid());
		
		List<CartVO> cartVOs = new ArrayList<CartVO>();
		
		for (CartPO cartPO : cartPOs) {
			
			cartVOs.add(cartPOToVO(cartPO));
			
		}
		
		return cartVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addCart(MuserVO muserVO, CartVO cartVO) throws FLException {
		
		MuserPO muserPO = muserDao.queryMuserByUnionId(muserVO.getUnionId());
		
		if(muserPO == null){
			throw new FLException(340009, "用户不存在");
		}
		
		List<CartPO> cartPOs = cartDao.queryCartByUid(muserPO.getUid());
		
		MpricePO mpricePO = mpriceDao.queryMpriceByPid(cartVO.getMprice().getPid());
		
		CartPO cartPO;
		
		if(cartPOs.size() == 0){
			
			cartPO = new CartPO(mpricePO);
			
			cartPO.setUid(muserPO.getUid());
			
			cartPO.setNum(cartVO.getNum());
			
			cartDao.save(cartPO);
			
		}else{
			
			List<Long> pids = new ArrayList<Long>();
			
			for (CartPO cart : cartPOs) {
				
				pids.add(cart.getMprice().getPid());
				
				if(cart.getMprice().getPid() == cartVO.getMprice().getPid()){
					
					short num = (short) Arith.add(cart.getNum(), cartVO.getNum());
					
					cart.setNum(num);
					
					cartDao.update(cart);
					
					break;
				}
				
			}
			if(!pids.contains(cartVO.getMprice().getPid())){
				
				if(cartPOs.size() >= 100){
					throw new FLException(340015, "购物车已满");
				}
				
				cartPO = new CartPO(mpricePO);
				
				cartPO.setUid(muserPO.getUid());
				
				cartPO.setNum(cartVO.getNum());
				
				cartDao.save(cartPO);
				
			}
		}
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateCart(MuserVO muserVO, CartVO cartVO) throws FLException {
		
		MuserPO muserPO = muserDao.queryMuserByUnionId(muserVO.getUnionId());
		
		if(muserPO == null){
			throw new FLException(340009, "用户不存在");
		}
		
		CartPO cartPO = cartDao.get(cartVO.getCid());
		
		if(cartPO.getMprice() == null){
			throw new FLException(340011, "购物车商品不存在");
		}
		
		MpricePO mpricePO = mpriceDao.queryMpriceByPid(cartPO.getMprice().getPid());
		
		cartPO.setMprice(mpricePO);
		cartPO.setNum(cartVO.getNum());
		
		cartDao.update(cartPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void clearCart(MuserVO muserVO, List<Long> cids) throws FLException {
		
		MuserPO muserPO = muserDao.queryMuserByUnionId(muserVO.getUnionId());
		
		if(muserPO == null){
			throw new FLException(340009, "用户不存在");
		}
		
		cartDao.clearCart(cids);
		
	}
	
	public CartVO cartPOToVO(CartPO cartPO){
		
		CartVO	cartVO = new CartVO(new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO()));
		
		BeanUtil.copyProperties(cartPO, cartVO, Arrays.asList("mprice"));
		BeanUtil.copyProperties(cartPO.getMprice(), cartVO.getMprice(), Arrays.asList("mgoods","mcolor","mformat"));
		BeanUtil.copyProperties(cartPO.getMprice().getMgoods(), cartVO.getMprice().getMgoods(), Arrays.asList("mbrand"));
		BeanUtil.copyProperties(cartPO.getMprice().getMcolor(), cartVO.getMprice().getMcolor());
		BeanUtil.copyProperties(cartPO.getMprice().getMformat(), cartVO.getMprice().getMformat());
		
		return cartVO;
		
	}

}
