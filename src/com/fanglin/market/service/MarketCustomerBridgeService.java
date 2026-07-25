package com.fanglin.market.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.vo.MarketInboundVO;

public interface MarketCustomerBridgeService {

	public BridgeResult acceptMarketInbound(MarketInboundVO marketInboundVO, String userId, int company) throws FLException;

	public static class BridgeResult {

		private boolean accepted;

		private Long csid;

		private Long ccid;

		private String orderId;

		private String message;

		public boolean isAccepted() {
			return accepted;
		}

		public void setAccepted(boolean accepted) {
			this.accepted = accepted;
		}

		public Long getCsid() {
			return csid;
		}

		public void setCsid(Long csid) {
			this.csid = csid;
		}

		public Long getCcid() {
			return ccid;
		}

		public void setCcid(Long ccid) {
			this.ccid = ccid;
		}

		public String getOrderId() {
			return orderId;
		}

		public void setOrderId(String orderId) {
			this.orderId = orderId;
		}

		public String getMessage() {
			return message;
		}

		public void setMessage(String message) {
			this.message = message;
		}
	}

}
