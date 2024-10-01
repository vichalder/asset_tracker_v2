#include <stdio.h>
#include <string.h>
#include "stm32f4xx_hal.h"
#include "lwip.h"
#include "lwip/apps/httpc.h"
#include "minmea.h"

// LTE-M modem UART handle
UART_HandleTypeDef huart1;

// GNSS module UART handle
UART_HandleTypeDef huart2;

// Server details
#define SERVER_IP "xxx.xxx.xxx.xxx"  // Replace with your server IP
#define SERVER_PORT 80

// Device ID
#define DEVICE_ID 1  // Replace with actual device ID

// Function prototypes
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_USART1_UART_Init(void);
static void MX_USART2_UART_Init(void);
void send_location_data(float latitude, float longitude);

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_USART1_UART_Init();
  MX_USART2_UART_Init();
  MX_LWIP_Init();

  char gnss_buffer[128];
  uint32_t gnss_index = 0;

  while (1)
  {
    // Read GNSS data
    uint8_t c;
    if (HAL_UART_Receive(&huart2, &c, 1, 100) == HAL_OK)
    {
      if (c == '\n')
      {
        gnss_buffer[gnss_index] = '\0';
        struct minmea_sentence_rmc frame;
        if (minmea_parse_rmc(&frame, gnss_buffer) == 1)
        {
          float latitude = minmea_tocoord(&frame.latitude);
          float longitude = minmea_tocoord(&frame.longitude);

          // Send location data to server
          send_location_data(latitude, longitude);

          // Wait for a while before sending the next update
          HAL_Delay(60000);  // 1 minute delay
        }
        gnss_index = 0;
      }
      else
      {
        gnss_buffer[gnss_index++] = c;
        if (gnss_index >= sizeof(gnss_buffer) - 1)
          gnss_index = 0;
      }
    }

    // Process any pending network events
    MX_LWIP_Process();
  }
}

void send_location_data(float latitude, float longitude)
{
  char payload[100];
  snprintf(payload, sizeof(payload), "{\"latitude\":%.6f,\"longitude\":%.6f}", latitude, longitude);

  struct httpc_connection_t *conn;
  char url[64];
  snprintf(url, sizeof(url), "/api/devices/%d/location", DEVICE_ID);

  err_t err = httpc_get_file_dns(
    SERVER_IP,
    SERVER_PORT,
    url,
    payload,
    NULL,
    NULL,
    NULL
  );

  if (err != ERR_OK) {
    printf("HTTP request failed\n");
  }
}

// Add implementations for SystemClock_Config, MX_GPIO_Init, MX_USART1_UART_Init, and MX_USART2_UART_Init here
// These functions will depend on your specific hardware configuration

void SystemClock_Config(void)
{
  // Configure the system clock
  // This will depend on your specific STM32F4 model and requirements
}

static void MX_GPIO_Init(void)
{
  // Initialize all configured GPIO pins
  // This will depend on your specific hardware configuration
}

static void MX_USART1_UART_Init(void)
{
  // Initialize USART1 for LTE-M modem communication
  huart1.Instance = USART1;
  huart1.Init.BaudRate = 115200;
  huart1.Init.WordLength = UART_WORDLENGTH_8B;
  huart1.Init.StopBits = UART_STOPBITS_1;
  huart1.Init.Parity = UART_PARITY_NONE;
  huart1.Init.Mode = UART_MODE_TX_RX;
  huart1.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart1.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart1) != HAL_OK)
  {
    Error_Handler();
  }
}

static void MX_USART2_UART_Init(void)
{
  // Initialize USART2 for GNSS module communication
  huart2.Instance = USART2;
  huart2.Init.BaudRate = 9600;
  huart2.Init.WordLength = UART_WORDLENGTH_8B;
  huart2.Init.StopBits = UART_STOPBITS_1;
  huart2.Init.Parity = UART_PARITY_NONE;
  huart2.Init.Mode = UART_MODE_TX_RX;
  huart2.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart2.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart2) != HAL_OK)
  {
    Error_Handler();
  }
}

void Error_Handler(void)
{
  // Handle errors here
  while(1);
}