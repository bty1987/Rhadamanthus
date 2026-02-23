package com.fanglin.decoration.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.NotificationService;
import com.fanglin.dingding.service.DingTalkMessageService;

@Service("notificationService")
public class NotificationServiceImpl implements NotificationService {

	@Autowired
	private DingTalkMessageService dingTalkMessageService;

	@Override
	public void sendDingtalk(String userId, String message, String type) {

		try {
			// 使用 DingTalkMessageService 发送钉钉消息
			int result = dingTalkMessageService.sendDing(userId, message, 1);

			if (result == 1) {
				System.out.println("========== 钉钉推送成功 ==========");
				System.out.println("用户ID: " + userId);
				System.out.println("消息类型: " + type);
				System.out.println("消息内容: " + message);
				System.out.println("================================");
			} else {
				System.err.println("========== 钉钉推送失败 ==========");
				System.err.println("用户ID: " + userId);
				System.err.println("消息类型: " + type);
				System.err.println("消息内容: " + message);
				System.err.println("返回结果: " + result);
				System.err.println("================================");
			}
		} catch (FLException e) {
			System.err.println("========== 钉钉推送异常 ==========");
			System.err.println("用户ID: " + userId);
			System.err.println("消息类型: " + type);
			System.err.println("消息内容: " + message);
			System.err.println("异常信息: " + e.getMessage());
			System.err.println("================================");
		}
	}
}
