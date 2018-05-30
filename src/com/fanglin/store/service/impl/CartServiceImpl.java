package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
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
	public List<CartVO> queryCartByUid(CartVO cartVO) {
		
		List<CartPO> cartPOs = cartDao.queryCartByUid(cartVO.getMuser().getUid());
		List<CartVO> cartVOs = new ArrayList<CartVO>();
		
		for (CartPO cartPO : cartPOs) {
			cartVO = new CartVO(new MuserVO(), new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO()));
			
			BeanUtil.copyProperties(cartPO, cartVO, Arrays.asList("muser","mprice"));
			BeanUtil.copyProperties(cartPO.getMuser(), cartVO.getMuser());
			BeanUtil.copyProperties(cartPO.getMprice(), cartVO.getMprice(), Arrays.asList("mgoods","mcolor","mformat"));
			BeanUtil.copyProperties(cartPO.getMprice().getMgoods(), cartVO.getMprice().getMgoods(), Arrays.asList("mbrand"));
			BeanUtil.copyProperties(cartPO.getMprice().getMcolor(), cartVO.getMprice().getMcolor(), Arrays.asList("mgoods"));
			BeanUtil.copyProperties(cartPO.getMprice().getMformat(), cartVO.getMprice().getMformat(), Arrays.asList("mgoods"));
			
			cartVOs.add(cartVO);
			
		}
		
		return cartVOs;
	}
	
	@Override
	public List<CartVO> queryCartByUnion(CartVO cartVO) {
		
		MuserPO muserPO = muserDao.queryMuserByUnion(cartVO.getMuser().getUnionVal());
		
		List<CartPO> cartPOs = cartDao.queryCartByUid(muserPO.getUid());
		List<CartVO> cartVOs = new ArrayList<CartVO>();
		
		for (CartPO cartPO : cartPOs) {
			cartVO = new CartVO(new MuserVO(), new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO()));
			
			BeanUtil.copyProperties(cartPO, cartVO, Arrays.asList("muser","mprice"));
			BeanUtil.copyProperties(cartPO.getMuser(), cartVO.getMuser());
			BeanUtil.copyProperties(cartPO.getMprice(), cartVO.getMprice(), Arrays.asList("mgoods","mcolor","mformat"));
			BeanUtil.copyProperties(cartPO.getMprice().getMgoods(), cartVO.getMprice().getMgoods(), Arrays.asList("mbrand"));
			BeanUtil.copyProperties(cartPO.getMprice().getMcolor(), cartVO.getMprice().getMcolor(), Arrays.asList("mgoods"));
			BeanUtil.copyProperties(cartPO.getMprice().getMformat(), cartVO.getMprice().getMformat(), Arrays.asList("mgoods"));
			
			cartVOs.add(cartVO);
			
		}
		
		return cartVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addOrUpdateCart(CartVO cartVO) throws FLException {
		
		List<CartPO> cartPOs = cartDao.queryCartByUid(cartVO.getMuser().getUid());
		MuserPO muserPO = muserDao.get(cartVO.getMuser().getUid());
		MpricePO mpricePO = mpriceDao.queryMpriceByPid(cartVO.getMprice().getPid());
		
		CartPO cartPO;
		
		if(cartPOs.size() == 0){
			
			cartPO = new CartPO(muserPO, mpricePO);
			
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
				
				cartPO = new CartPO(muserPO, mpricePO);
				cartPO.setNum(cartVO.getNum());
				
				cartDao.save(cartPO);
			}
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateCart(CartVO cartVO) throws FLException {
		
		CartPO cartPO = cartDao.get(cartVO.getCid());
		
		if(cartVO.getMprice() != null){
			MpricePO mpricePO = mpriceDao.queryMpriceByPid(cartVO.getMprice().getPid());
			
			cartPO.setMprice(mpricePO);
		}
		
		cartPO.setNum(cartVO.getNum());
		
		cartDao.update(cartPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteCartByCid(CartVO cartVO) throws FLException {
		
		CartPO cartPO = cartDao.get(cartVO.getCid());
		
		cartDao.delete(cartPO);
		
		return 0;
	}

	
	
}
